"use client"

import React, { useContext, useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import { AuthContext } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoading } from "@/context/LoadingContext";


// Form validation schema
const schema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});


const Login = () => {
    const { currentUser } = useContext(AuthContext);
    const router = useRouter();
    const [err, setErr] = useState(null);
    const { setIsLoading } = useLoading();

    const { register, handleSubmit, formState: { errors } } = useForm(
        { resolver: yupResolver(schema) }
    );

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

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, data);
            localStorage.setItem('access_token', res.data.access_token)
            localStorage.setItem('user_id', res.data.user.id)
            router.push("/")
        } catch(err) {
            setErr(err?.response?.data || "Login failed, please try again");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-black-100">
            <div className="bg-black p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            {...register("username")}
                            placeholder="Username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.username.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            {...register("password")}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        Login
                    </button>
                    {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
                    <p className="text-sm text-center text-gray-600">
                        No account?{' '}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Register Here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login