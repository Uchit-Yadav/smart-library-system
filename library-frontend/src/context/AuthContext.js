// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION CONTEXT
// ═══════════════════════════════════════════════════════════════════════════
// WHY Context?
//   Multiple components need to know "who is logged in" — Navbar, Dashboard,
//   ProtectedRoute, Admin panel, etc. Instead of passing user data through
//   every component as props ("prop drilling"), Context creates a global
//   store that any component can subscribe to.
//
// HOW IT WORKS:
//   1. AuthProvider wraps the entire app
//   2. It stores { user, token } in React state
//   3. On page load, it checks localStorage for saved sessions
//   4. Any child component calls useAuth() to get user, login(), logout()

import { useState, useEffect, useContext, createContext } from "react";
import mockAPI from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("sl_token");
    const savedUser = localStorage.getItem("sl_user");
    if (savedToken && savedUser) {
      try { setToken(savedToken); setUser(JSON.parse(savedUser)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await mockAPI.login(email, password);
    localStorage.setItem("sl_token", result.token);
    localStorage.setItem("sl_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result.user;
  };

  const register = async (data) => {
    return await mockAPI.register(data);
  };

  const logout = () => {
    localStorage.removeItem("sl_token");
    localStorage.removeItem("sl_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token, isAdmin: user?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
