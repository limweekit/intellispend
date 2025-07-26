"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createBill, updateBill } from "./api.js";
import { GET_BILLS_KEY } from "../lib/constants.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLoading } from "@/context/LoadingContext";


export default function BillsForm({
  initialData,
  billId,
  onCancel,
}) {
  const queryClient = useQueryClient();
  const { setIsLoading } = useLoading();

  const formik = useFormik({
    initialValues: {
      amount: initialData?.amount || "",
      name: initialData?.name || "",
      due_date: initialData?.due_date || "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .positive("Amount must be greater than 0")
        .required("Amount is required"),
      name: Yup.string().required("Name is required"),
      due_date: Yup.date().required("Due date is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);

      const payload = {
        amount: values.amount,
        due_date: values.due_date,
        name: values.name,
      };

      try {
        if (billId) {
          await updateBill({ id: billId, bill: payload });
        } else {
          await createBill(payload);
        }
        queryClient.invalidateQueries([GET_BILLS_KEY]);
        resetForm();
        if (onCancel) onCancel();
      } catch (err) {
        console.error("Failed to submit form:", err);
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount"
        name="amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900 placeholder-gray-500"
      />
      {formik.touched.amount && formik.errors.amount && (
        <p className="text-red-500 text-sm">{formik.errors.amount}</p>
      )}
      {/* Due date */}
      <input
        type="date"
        name="due_date"
        value={formik.values.due_date}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900"
      />
      {formik.touched.due_date && formik.errors.due_date && (
        <p className="text-red-500 text-sm">{formik.errors.due_date}</p>
      )}

      {/* Name */}
      <textarea
        placeholder="Name"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900 placeholder-gray-500"
      />
      {formik.touched.name && formik.errors.name && (
        <p className="text-red-500 text-sm">{formik.errors.name}</p>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          type="submit"
          className="cursor-pointer bg-blue-600 hover:opacity-90 text-white px-4 py-2 rounded"
          disabled={formik.isSubmitting}
        >
          {billId ? "Update Bill" : "Add Bill"}
        </button>
        {billId && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
