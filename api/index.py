import os
from typing import Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from supabase import Client, create_client

load_dotenv()  # reads .env locally; on Vercel the variables are injected
app = FastAPI()


def get_db() -> Client:
    """New client per request so one user's login never leaks into another call.
    Keys come ONLY from environment variables."""
    return create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])


def current_user(authorization: Optional[str]):
    """Verify the Bearer token with Supabase and return the user."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Please log in to continue.")
    token = authorization.split(" ", 1)[1]
    try:
        return get_db().auth.get_user(token).user
    except Exception:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")


# ---------- Models ----------
class SignUp(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=6, max_length=72)


class Login(BaseModel):
    email: str
    password: str


class ReportIn(BaseModel):
    region: str
    destination: str
    hazard_type: Literal["Landslide", "Flooding", "Road Closed", "Other"]
    severity: Literal["Low", "Medium", "High"]
    description: str = Field(min_length=1, max_length=500)


# ---------- Auth ----------
@app.post("/api/auth/signup")
def signup(body: SignUp):
    try:
        get_db().auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {"data": {"full_name": body.name}},
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Could not create account. Try a different email.")
    return {"message": "Account created"}


@app.post("/api/auth/login")
def login(body: Login):
    try:
        res = get_db().auth.sign_in_with_password({"email": body.email, "password": body.password})
    except Exception:
        # Same message for wrong email or wrong password (no account enumeration)
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    return {
        "access_token": res.session.access_token,
        "name": (res.user.user_metadata or {}).get("full_name", ""),
    }


# ---------- Public data ----------
@app.get("/api/regions")
def regions():
    return get_db().table("regions").select("*").order("id").execute().data


@app.get("/api/destinations")
def destinations(region: Optional[str] = None):
    db = get_db()
    q = db.table("destinations").select("id,name,icon,region_id")
    if region:
        r = db.table("regions").select("id").eq("name", region).execute().data
        if not r:
            return []
        q = q.eq("region_id", r[0]["id"])
    return q.execute().data


# ---------- Reports (login required) ----------
@app.post("/api/reports")
def create_report(body: ReportIn, authorization: Optional[str] = Header(None)):
    user = current_user(authorization)
    row = body.model_dump()
    row["user_id"] = user.id  # taken from the verified token, never from the client
    return get_db().table("reports").insert(row).execute().data[0]


@app.get("/api/reports/mine")
def my_reports(authorization: Optional[str] = Header(None)):
    user = current_user(authorization)
    return (get_db().table("reports").select("*")
            .eq("user_id", user.id).order("created_at", desc=True).execute().data)


@app.get("/api/reports")
def all_reports(hazard_type: Optional[str] = None, authorization: Optional[str] = Header(None)):
    current_user(authorization)
    q = get_db().table("reports").select("*").order("created_at", desc=True)
    if hazard_type:
        q = q.eq("hazard_type", hazard_type)
    return q.execute().data
