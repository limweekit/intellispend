"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import ProfileForm from "@/app/profile/ProfileForm";
import {useLoading} from "@/context/LoadingContext";

export default function EditProfilePage() {
  const { currentUser, authLoaded, setCurrentUser } = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (!authLoaded) {
      setIsLoading(true);
      return;
    }

    if (!currentUser) {
      setIsLoading(false);
      router.replace("/login");
    } else {
      setUser(currentUser.user);
      setIsLoading(false);
    }
  }, [authLoaded, currentUser, router, setIsLoading]);

  const handleUpdate = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    setCurrentUser({ ...currentUser, user: updatedUser });
  };

  if (!authLoaded || !user) return null;

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md">
        <ProfileForm initialUser={user} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
