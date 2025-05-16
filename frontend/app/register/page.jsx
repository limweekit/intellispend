"use client"

import React, { useContext, useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import { AuthContext } from "@/context/AuthContext";


const Register = () => {
    const { currentUser } = useContext(AuthContext);
    const [err, setError] = useState(null);
    const router = useRouter();


    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        email: "",
    })

    // Check if user is already logged in i.e. access token is present in local storage
    // If not logged in, redirect to login page
    useEffect(() => {
      if (currentUser === null) return;

      if (!currentUser?.access_token) {
        router.replace("/login");
      } else {
          router.replace("/");
      }
    }, [currentUser]);


    const handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
    }


    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`, inputs)
            localStorage.setItem('access_token', res.data.access_token)
            localStorage.setItem('user_id', res.data.user.id)
            router.push("/")
        } catch(err) {
            setError(err?.response?.data || "Registration failed");
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-black-100">
            <div className="bg-black p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        required
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        required
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        Register
                    </button>
                    {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register