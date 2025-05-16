"use client"

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();


// Provider that wraps the app and manages auth state
export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);


    // On component mount, load user data from local storage
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      }
    }, []);


    // update local storage whenever the user state changes
    useEffect(() => {
      if (typeof window !== "undefined" && currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
    }, [currentUser]);


    // login and logout functions
    const login = async (inputs) => {
      const res = await axios.post("/users/login", inputs);
      setCurrentUser(res.data);
    };

    const logout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
      setCurrentUser(null);
    };


    // Provide context values to children components
    return (
        <AuthContext.Provider value={{currentUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}