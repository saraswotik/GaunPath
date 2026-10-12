# GaunPath

Community-verified road conditions for rural Nepal.

**Stack:** React (Vite) + Tailwind CSS + React Router · Python FastAPI backend (`api/index.py`) · Supabase (Postgres + Auth) · hosted on Vercel.

## How it works
`React (src/)  →  /api/... (Python FastAPI)  →  Supabase`
The browser only talks to the Python API. The Supabase URL and secret key are read from environment variables by the backend only, so no keys exist in the frontend code.

## Screens
Welcome · Sign Up · Log In · Select Region · Plan Your Trip · Report Road Condition · Confirmation · Road Alerts

## Run locally
1. Create the database: run `supabase_setup.sql` in the Supabase SQL Editor.
2. Copy `.env.example` to `.env` and add your `SUPABASE_URL` and `SUPABASE_KEY`.
3. Backend: `pip install -r requirements.txt` then `uvicorn api.index:app --reload --port 8000`
4. Frontend (second terminal): `npm install` then `npm run dev`

## Environment variables
`SUPABASE_URL`, `SUPABASE_KEY` — set in `.env` locally and in the Vercel project settings.

## Folder structure
```
api/index.py        Python FastAPI backend
src/api.js          all frontend calls to the backend
src/context/        login state and reports state
src/screens/        the 8 screens
src/components/     reusable UI components
supabase_setup.sql  database tables and seed data
vercel.json         routing for Vercel
```
