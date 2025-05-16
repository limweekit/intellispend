"use client"

import Link from 'next/link'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';


export default function Header() {
    const { currentUser, logout } = useContext(AuthContext);
    const router = useRouter();

    // On logout, redirect user to login page
    const handleLogout = () => {
        logout();
        router.push('/login');
    };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-semibold cursor-pointer"
        >
          IntelliSpend
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/expenses" className="hover:text-blue-600">
            Expenses
          </Link>
          <button onClick={handleLogout} className="hover:text-red-600">
              Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
