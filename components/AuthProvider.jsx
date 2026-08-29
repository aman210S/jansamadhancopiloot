"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  officer: null,
  loading: true,
  loginUser: async () => {},
  registerUser: async () => {},
  logoutUser: () => {},
  loginOfficer: async () => {},
  logoutOfficer: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("jan-user");
      const storedOfficer = localStorage.getItem("jan-officer");
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedOfficer) setOfficer(JSON.parse(storedOfficer));
    } catch {
      // ignore corrupt session storage
    }
    setLoading(false);
  }, []);

  const loginUser = useCallback(async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("jan-user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const registerUser = useCallback(async ({ name, email, phone, password }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem("jan-user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("jan-user");
    setUser(null);
  }, []);

  const loginOfficer = useCallback(async (officerId, password) => {
    const res = await fetch("/api/auth/officer-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officerId, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Officer login failed");
    localStorage.setItem("jan-officer", JSON.stringify(data.officer));
    setOfficer(data.officer);
    return data.officer;
  }, []);

  const logoutOfficer = useCallback(() => {
    localStorage.removeItem("jan-officer");
    setOfficer(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      officer,
      loading,
      loginUser,
      registerUser,
      logoutUser,
      loginOfficer,
      logoutOfficer,
    }),
    [user, officer, loading, loginUser, registerUser, logoutUser, loginOfficer, logoutOfficer],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
