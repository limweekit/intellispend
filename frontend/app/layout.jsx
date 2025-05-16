"use client"

import Header from '../components/Header'
import Footer from '../components/Footer'
import './globals.css'
import { AuthContextProvider } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [showLayout, setShowLayout] = useState(true);

    useEffect(() => {
      const authPages = ['/login', '/register'];
      setShowLayout(!authPages.includes(pathname));
    }, [pathname]);


    const metadata = {
      title: 'IntelliSpend',
      description: 'Your AI-powered personal finance app',
    }

    return (
        <html lang="en">
          <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
              <AuthContextProvider>
                {showLayout && <Header />}
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {children}
                    </main>
                  {showLayout && <Footer />}
              </AuthContextProvider>
          </body>
        </html>
    )
}