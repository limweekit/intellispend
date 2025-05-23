"use client"

import Link from 'next/link'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';


export default function Header() {
    const { currentUser, logout } = useContext(AuthContext);
    const router = useRouter();
    const { setIsLoading } = useLoading();


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
            <Link
              href="/"
              className="text-2xl text-gray-800 font-semibold cursor-pointer"
            >
              IntelliSpend
            </Link>
            <nav className="space-x-4">
              <Link href="/" className="text-gray-800 hover:text-blue-600">
                Home
              </Link>
              <Link href="/expenses" className="text-gray-800 hover:text-blue-600">
                Expenses
              </Link>
              <Link href="/profile" className="text-gray-800 hover:text-blue-600">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-gray-800 hover:text-red-600">
                  Logout
              </button>
            </nav>
          </div>
        </header>
      )
}
