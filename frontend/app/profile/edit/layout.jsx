"use client";

import Spinner from "@/components/Spinner";
import React from "react";
import {AuthContextProvider} from "@/context/AuthContext";
import {LoadingProvider} from "@/context/LoadingContext";

export default function EditProfileLayout({ children }) {
  return (
    <AuthContextProvider>
      <LoadingProvider>
        <Spinner />
          <main className="min-h-full bg-gradient-to-br from-indogo-100 via-purple-100 to-pink-100">
            {children}
          </main>
     </LoadingProvider>
    </AuthContextProvider>
  );
}
