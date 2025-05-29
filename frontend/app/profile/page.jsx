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

  // While we're checking auth
  if (!authLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Checking authentication…
      </div>
    );
  }

  // If there's no user, don't render
  if (!currentUser) {
    return null;
  }

  // Pull the user payload straight from context
  const { user } = currentUser;

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md">
        <ProfileCard user={user} />
      </div>
    </div>
  );
}

