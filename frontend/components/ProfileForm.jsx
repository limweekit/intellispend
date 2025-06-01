"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { useLoading } from "@/context/LoadingContext";
import {useFormik} from "formik";

export default function ProfileForm({ initialUser, onUpdate }) {
  const [passError, setPassError] = useState("");
  const { isLoading, setIsLoading } = useLoading();

  const formik = useFormik({
    initialValues: {
      username: initialUser.username || "",
      email: initialUser.email || "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      setPassError("");

      // Password match check
      if (values.newPassword && values.newPassword !== values.confirmPassword) {
        setPassError("Passwords do not match");
        return;
      }

      const payload = {
        username: values.username,
        email: values.email,
      };
      if (values.newPassword) {
        payload.password = values.newPassword;
      }

      setIsLoading(true);
      try {
        await API.put("/users/update", payload);
        onUpdate({ username: values.username, email: values.email });
      } catch (err) {
        console.error(err);
        const pwErrors = err?.response?.data?.password;
        if (pwErrors) {
          setPassError(Array.isArray(pwErrors) ? pwErrors.join(" ") : pwErrors);
        } else {
          alert(err?.response?.data?.error || "Update failed");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Edit Your Profile
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={formik.values.password}
          onChange={formik.handleChange}
          placeholder="Leave blank to keep current password"
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          placeholder="Confirm new password"
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {passError && (
          <p className="text-red-500 text-sm mt-2">{passError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
