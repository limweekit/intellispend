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
      localStorage.setItem("access_token", currentUser.access_token);
      if (currentUser.refresh_token) {
        localStorage.setItem("refresh_token", currentUser.refresh_token);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, authLoaded, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
