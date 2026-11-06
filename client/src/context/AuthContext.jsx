import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current logged in user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("sb_token");
        if (token) {
          const res = await api.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
          }
        }
      } catch (err) {
        localStorage.removeItem("sb_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const loginUser = (userData, token) => {
    if (token) localStorage.setItem("sb_token", token);
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("sb_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
