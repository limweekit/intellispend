"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be valid"),
});

export default function Register() {
  const { currentUser, login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // If already logged in, go home
  useEffect(() => {
    if (currentUser?.access_token) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErr(null);

    try {
      // Register endpoint
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        data
      );
      // Automatically log in after successful registration
      await login({ username: data.username, password: data.password });
      router.push("/");
    } catch (e) {
      setErr(e?.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full bg-white">
      <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-20">
        <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-center sm:text-3xl text-blue-800">
            Register
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  {...register("username")}
                  placeholder="Username"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-300 placeholder-gray-500 text-sm text-gray-800 focus:border focus:outline-none"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-300 placeholder-gray-500 text-sm text-gray-800 focus:border focus:outline-none"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-300 placeholder-gray-500 text-sm text-gray-800 focus:border focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="md:mt-5 tracking-wide font-semibold bg-blue-800 text-white w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                Register
              </button>
              {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Logo side panel */}
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex">
          <img
            src="/IntelliSpendLogo.png"
            alt="IntelliSpend Logo"
            className="h-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
