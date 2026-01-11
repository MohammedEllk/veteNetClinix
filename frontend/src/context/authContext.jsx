// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { getCurrentUser, login as apiLogin, logout as apiLogout } from "../services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au chargement : si token dans localStorage → essayer de récupérer le user
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        setLoading(false);
        return;
    }

    try {
        const u = getCurrentUser();   // ✅ sync
        setUser(u);                  // u peut être null => OK
    } finally {
        setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const u = await apiLogin(email, password);
    setUser(u);
  };

  /*const register = async (name, email, password) => {
    const u = await apiRegister(name, email, password);
    setUser(u);
  };*/

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}