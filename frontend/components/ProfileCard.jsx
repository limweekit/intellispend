"use client";

import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";

export default function ProfileCard() {
  const placeholderAvatar = "https://www.gravatar.com/avatar?d=identicon&s=200";
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const { isLoading, setIsLoading } = useLoading();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const res = JSON.parse(stored);
      setUsername(res?.user?.username);
      setEmail(res?.user?.email);
    }
  }, []);


  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsLoading(true);
    setDeleting(true);

    try {
      await API.delete("/users/delete");
      // Clear auth state
      logout();
      // Redirect to login
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to delete account");
    } finally {
      setIsLoading(false);
      setDeleting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-2xl rounded-2xl p-8 max-w-md w-full flex flex-col items-center">
      <img
        src={placeholderAvatar}
        alt="Avatar"
        className="w-28 h-28 rounded-full border-4 border-white mb-4 shadow-lg"
      />
      <h2 className="text-2xl font-bold mb-1">{username}</h2>
      <p className="mb-4 opacity-90">{email}</p>
      <div className="mt-4 flex space-x-4">
        <Link href="/profile/edit">
          <button className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full shadow-lg hover:opacity-90 transition cursor-pointer">
            Edit Profile
          </button>
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-red-700 transition disabled:opacity-50 cursor-pointer">
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
