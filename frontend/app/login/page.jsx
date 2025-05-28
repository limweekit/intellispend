"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function Login() {
  const { currentUser, login } = useContext(AuthContext);
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const [err, setErr] = useState(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // If we're already logged in, go home
  useEffect(() => {
    if (currentUser?.access_token) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErr(null);
    try {
      await login(data);
      router.push("/");
    } catch (e) {
      // show error from API or fallback message
      setErr(e?.response?.data?.error || "Login failed, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full bg-white">
      <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md flex justify-between items-stretch px-5 py-20">
        <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-center sm:text-3xl text-blue-800">
            Login
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  {...formRegister("username")}
                  placeholder="Username"
                  className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-2">{errors.username.message}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  {...formRegister("password")}
                  placeholder="Password"
                  className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-800 text-white w-full rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={false}
              >
                Login
              </button>
              {err && <p className="text-red-500 text-sm mt-2">{err}</p>}
              <p className="text-sm text-center text-gray-600">
                No account?{" "}
                <Link href="/register" className="text-blue-500 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="sm:w-[60%] lg:w-[50%] hidden md:flex bg-cover bg-center">
          <img alt="login image" className="h-[500px] object-contain" />
        </div>
      </div>
    </div>
  );
}
