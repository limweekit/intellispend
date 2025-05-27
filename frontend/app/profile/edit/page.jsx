"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProfileForm from "@/components/ProfileForm";

export default function EditProfilePage() {
  const { currentUser, authLoaded, setCurrentUser } = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!authLoaded) return;

    if (!currentUser) {
      router.replace("/login");
    } else {
      setUser(currentUser.user);
    }
  }, [authLoaded, currentUser, router]);

  const handleUpdate = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    setCurrentUser({ ...currentUser, user: updatedUser });
  };

  if (!authLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        { !authLoaded ? "Checking authentication…" : "Loading…" }
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md">
        <ProfileForm initialUser={user} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
