"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { useLoading } from "@/context/LoadingContext";
import { useFormik } from "formik";
import * as yup from "yup";
import { AuthContext } from "@/context/AuthContext";

// Validation schema 
const schema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),
  email: yup
    .string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  newPassword: yup
    .string()
    .test(
      "password-strength",
      "Password must be at least 8 characters, including upper, lower, number, and special characters.",
      (value) => {
        if (!value) return true; // optional
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        return value.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;
      }
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], "Passwords must match")
    .when('newPassword', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required("Please confirm your new password"),
      otherwise: (schema) => schema.optional(),
    }),
});

export default function ProfileForm({ initialUser, onUpdate }) {
  const [passError, setPassError] = useState("");
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();
  const {setCurrentUser, currentUser} = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: initialUser.username || "",
      email: initialUser.email || "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setPassError("");

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
        router.push("/profile")
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
          onBlur={formik.handleBlur}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {formik.touched.username && formik.errors.username && (
          <p className="text-red-500 text-sm mt-2">
            {formik.errors.username}
          </p>
        )}
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
          onBlur={formik.handleBlur}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm mt-2">
            {formik.errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Leave blank to keep current password"
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <p className="text-red-500 text-sm mt-2">
            {formik.errors.newPassword}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Confirm new password"
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {formik.touched.confirmPassword &&
          formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-2">
              {formik.errors.confirmPassword}
            </p>
          )}
        {passError && <p className="text-red-500 text-sm mt-2">{passError}</p>}
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
