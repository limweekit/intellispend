"use client"
import '../globals.css'
import { AuthContextProvider } from "@/context/AuthContext";
import { useEffect, useState } from 'react';
import { LoadingProvider } from "@/context/LoadingContext";
import Spinner from "@/components/Spinner";


export default function RootLayout({ children }) {
    return (
      <AuthContextProvider>
        <LoadingProvider>
          <Spinner />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
        </LoadingProvider>
      </AuthContextProvider>
    )
}