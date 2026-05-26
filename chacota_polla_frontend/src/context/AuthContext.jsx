import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("chacota_polla_session");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (usuario, password) => {
    const data = await api.login({ usuario, password });
    localStorage.setItem("chacota_polla_session", JSON.stringify(data));
    setSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("chacota_polla_session");
    setSession(null);
  };

  const value = useMemo(() => ({
    session,
    user: session?.usuario || null,
    isAdmin: session?.usuario?.rol === "ADMIN",
    login,
    logout
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
