"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { useLoading } from "@/context/LoadingContext";

export default function ProfileForm({ initialUser, onUpdate }) {
  const [username, setUsername] = useState(initialUser.username);
  const [email, setEmail] = useState(initialUser.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPassError("");

    // 1) If user entered a password, require match
    if (newPassword && newPassword !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }

    // 2) Build payload
    const payload = { username, email };
    if (newPassword) {
      payload.password = newPassword;
    }

    setIsLoading(true);
    try {
      await API.put("/users/update", payload);

      // Update username/email in context + local state
      onUpdate({ username, email });

      // Clear passwords
      setNewPassword("");
      setConfirmPassword("");

      // Navigate back to profile  
      router.push("/profile");
    } catch (err) {
      console.error(err);
      // Show backend password errors if any
      const pwErrors = err?.response?.data?.password;
      if (pwErrors) {
        setPassError(Array.isArray(pwErrors) ? pwErrors.join(" ") : pwErrors);
      } else {
        alert(err?.response?.data?.error || "Update failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Edit Your Profile
      </h2>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {passError && (
          <p className="text-red-500 text-sm mt-2">{passError}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
