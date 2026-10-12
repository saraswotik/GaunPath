/*
 * api.js — ALL network calls live here.
 * The browser only talks to OUR Python backend (/api/...).
 * It never talks to Supabase directly, so no keys exist in the frontend.
 */
const BASE = "/api";
let token = sessionStorage.getItem("gp_token") || null;

export const isLoggedIn = () => !!token;
export const logout = () => {
  token = null;
  sessionStorage.removeItem("gp_token");
};

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  let res;
  try {
    res = await fetch(BASE + path, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) {
    logout();
    window.dispatchEvent(new Event("gp-auth-expired"));
  }
  if (!res.ok) {
    const detail = Array.isArray(data.detail) ? "Please check the details you entered." : data.detail;
    throw new Error(detail || "Something went wrong. Please try again.");
  }
  return data;
}

/* DB rows use snake_case; the screens use camelCase. Convert here once. */
const toReport = (r) => ({
  id: r.id,
  region: r.region,
  destination: r.destination,
  hazardType: r.hazard_type,
  severity: r.severity,
  description: r.description,
  timestamp: r.created_at,
});

export const signUp = (name, email, password) =>
  request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });

export async function login(email, password) {
  const data = await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  token = data.access_token;
  sessionStorage.setItem("gp_token", token);
  return data; // { access_token, name }
}

export const getRegions = () => request("/regions");

export const getDestinations = (region) =>
  request("/destinations" + (region ? "?region=" + encodeURIComponent(region) : ""));

export const createReport = async (r) =>
  toReport(
    await request("/reports", {
      method: "POST",
      body: JSON.stringify({
        region: r.region,
        destination: r.destination,
        hazard_type: r.hazardType,
        severity: r.severity,
        description: r.description,
      }),
    })
  );

export const getMyReports = async () => (await request("/reports/mine")).map(toReport);

export const getAllReports = async (hazardType) =>
  (await request("/reports" + (hazardType ? "?hazard_type=" + encodeURIComponent(hazardType) : ""))).map(toReport);
