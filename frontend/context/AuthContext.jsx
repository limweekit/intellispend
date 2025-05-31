"use client";

import { createContext, useState, useEffect } from "react";
import API from "@/app/lib/api";             

export const AuthContext = createContext({
  currentUser: null,
  login: async () => {},
  logout: () => {},
  authLoaded: false,
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    }
    setAuthLoaded(true);
  }, []);

  useEffect(() => {
    if (!authLoaded) return;

    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser, authLoaded]);

  // Login & logout
  const login = async (credentials) => {
    const res = await API.post("/users/login", credentials);
    setCurrentUser(res.data);
    return res.data;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, authLoaded, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
