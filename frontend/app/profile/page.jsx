"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProfileCard from "@/components/ProfileCard";

export default function ProfilePage() {
  const { currentUser, authLoaded } = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Only redirect after we know authLoaded is true
  useEffect(() => {
    if (!authLoaded) return;

    if (!currentUser) {
      router.replace("/login");
    } else {
      setUser(currentUser.user);
    }
  }, [authLoaded, currentUser, router]);

  if (!authLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        { !authLoaded ? "Checking authentication…" : "Loading profile…" }
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md">
        <ProfileCard user={user} />
      </div>
    </div>
  );
}
