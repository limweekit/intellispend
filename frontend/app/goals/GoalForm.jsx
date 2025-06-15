"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createGoal, updateGoal } from "./api.js";
import { GET_GOALS_KEY } from "../lib/constants.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoading } from "@/context/LoadingContext";

export default function GoalForm({ initialData = {}, onCancel }) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialData.goal_id);
  const { setIsLoading } = useLoading();

  const formik = useFormik({
    initialValues: {
      name:     initialData.name     || "",
      amount:   initialData.amount   || "",
      deadline: initialData.deadline
        ? initialData.deadline.split("T")[0]
        : "",
    },
    validationSchema: Yup.object({
      name:     Yup.string().required("Name is required"),
      amount:   Yup.number().positive("Must be > 0").required("Amount is required"),
      deadline: Yup.date().required("Deadline is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);
      try {
        if (isEdit) {
          await updateGoal({ id: initialData.goal_id, goal: values });
        } else {
          await createGoal(values);
        }
        queryClient.invalidateQueries([GET_GOALS_KEY]);
        resetForm();
        if (onCancel) onCancel();
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
      {/* Name */}
      <div>
        <label className="block font-medium text-gray-700">Goal Name</label>
        <input
          name="name"
          type="text"
          className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block font-medium text-gray-700">Target Amount ($)</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-red-500 text-sm">{formik.errors.amount}</p>
        )}
      </div>

      {/* Deadline */}
      <div>
        <label className="block font-medium text-gray-700">Deadline</label>
        <input
          name="deadline"
          type="date"
          className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900"
          value={formik.values.deadline}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.deadline && formik.errors.deadline && (
          <p className="text-red-500 text-sm">{formik.errors.deadline}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          {isEdit ? "Update Goal" : "Create Goal"}
        </button>
      </div>
    </form>
  );
}
