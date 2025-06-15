"use client"

import Link from 'next/link'
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';


export default function Header() {
    const { logout } = useContext(AuthContext);
    const router = useRouter();
    const { setIsLoading } = useLoading();


    const navigate = async (path) => {
        setIsLoading(true);
        try {
          await new Promise((res) => setTimeout(res, 300)); // optional delay
          router.push(path);
        } finally {
          setIsLoading(false);
        }
    };


    // On logout, redirect user to login page
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            await new Promise((res) => setTimeout(res, 300));
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => navigate("/")}
              className="text-2xl text-gray-800 font-semibold cursor-pointer"
            >
              IntelliSpend
            </button>
             <nav className="space-x-4">
               <button
                 onClick={() => navigate("/")}
                 className="cursor-pointer text-gray-800 hover:text-blue-600"
               >
                 Home
               </button>
               <button
                 onClick={() => navigate("/expenses")}
                 className="cursor-pointer text-gray-800 hover:text-blue-600"
               >
                 Expenses
               </button>
               <button
                 onClick={() => navigate("/income")}
                 className="cursor-pointer text-gray-800 hover:text-blue-600"
               >
                 Income
               </button>
               <button
                 onClick={() => navigate("/goals")}
                 className="cursor-pointer text-gray-800 hover:text-blue-600"
               >
                 Goals
               </button>
               <button
                 onClick={() => navigate("/profile")}
                 className="cursor-pointer text-gray-800 hover:text-blue-600"
               >
                 Profile
               </button>
               <button
                   onClick={handleLogout}
                   className="cursor-pointer text-gray-800 hover:text-red-600"
               >
                   Logout
               </button>
             </nav>
          </div>
        </header>
      )
}
