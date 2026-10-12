import { createContext, useContext, useEffect, useState } from "react";
import { isLoggedIn, logout } from "../api";

/*
 * AuthContext.jsx — shared login state.
 * The real login is done by the Python backend + Supabase Auth.
 * Passwords are NEVER stored here; only the user's display name and
 * whether a valid session token exists.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [userName, setUserName] = useState(sessionStorage.getItem("gp_name") || "");

  const signIn = (name) => {
    sessionStorage.setItem("gp_name", name || "");
    setUserName(name || "");
    setLoggedIn(true);
  };

  const signOut = () => {
    logout();
    sessionStorage.removeItem("gp_name");
    setUserName("");
    setLoggedIn(false);
  };

  /* If the backend says the session expired, log the user out of the UI too. */
  useEffect(() => {
    const onExpired = () => {
      sessionStorage.removeItem("gp_name");
      setUserName("");
      setLoggedIn(false);
    };
    window.addEventListener("gp-auth-expired", onExpired);
    return () => window.removeEventListener("gp-auth-expired", onExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, userName, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
