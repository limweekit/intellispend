"use client"

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function HomePage() {
    const router = useRouter();
    const { currentUser } = useContext(AuthContext);

    // if user has no access token i.e. not logged in, redirect to login page
    useEffect(() => {
      if (currentUser?.access_token === null) {
          router.replace("/login")
      }
    }, [currentUser]);

    return (
      <section className="text-center">
        <h1 className="text-4xl font-bold">Manage Your Finances With IntelliSpend</h1>
        <p className="mt-4 text-lg text-gray-700">
          Your AI-driven personal finance manager.
        </p>
      </section>
    )
}