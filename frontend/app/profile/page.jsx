"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProfileCard from "@/components/ProfileCard";

export default function ProfilePage() {
  const { currentUser, authLoaded } = useContext(AuthContext);
  const router = useRouter();

  // Redirect to login if auth has loaded and there's no user
  useEffect(() => {
    if (!authLoaded) return;
    if (!currentUser) {
      router.replace("/login");
    }
  }, [authLoaded, currentUser, router]);

  // If there's no user, don't render
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md">
        <ProfileCard />
      </div>
    </div>
  );
}

