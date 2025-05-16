"use client"
import '../globals.css'
import { AuthContextProvider } from "@/context/AuthContext";
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
          <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
              <AuthContextProvider>
                  <main className="flex-grow container mx-auto px-4 py-8">
                      {children}
                  </main>
              </AuthContextProvider>
          </body>
        </html>
    )
}