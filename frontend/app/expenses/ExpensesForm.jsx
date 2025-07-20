"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createExpense, updateExpense, createCategory } from "./api.js";
import { GET_EXPENSES_KEY, GET_CATEGORIES_KEY } from "../lib/constants.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLoading } from "@/context/LoadingContext";

const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function ExpensesForm({
  initialData,
  expenseId,
  onCancel,
  categories = [],
}) {
  const queryClient = useQueryClient();
  const { setIsLoading } = useLoading();
  const defaultCategoryNames = [
    "Transport",
    "Dining",
    "Bills",
    "Shopping",
    "Others",
  ];

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const formik = useFormik({
    initialValues: {
      amount: initialData?.amount || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      date: initialData?.date || "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .positive("Amount must be greater than 0")
        .required("Amount is required"),
      category: Yup.string().required("Category is required"),
      description: Yup.string().required("Description is required"),
      date: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);
      let categoryId = values.category;

      if (showNewCategoryInput && newCategoryName.trim()) {
        const res = await createCategory(newCategoryName.trim(), "expense");
        categoryId = res.category.category_id;
      }
      else if (uuidv4Regex.test(values.category)) {
        categoryId = values.category;
      }
      else if (defaultCategoryNames.includes(values.category)) {
        const existing = categories.find(
          (c) => c.name.toLowerCase() === values.category.toLowerCase()
        );
        if (existing) {
          categoryId = existing.category_id;
        } else {
          const res = await createCategory(values.category, "expense");
          categoryId = res.category.category_id;
        }
      }

      const payload = {
        amount: values.amount,
        category: categoryId,
        date: values.date,
        description: values.description,
      };

      try {
        if (expenseId) {
          await updateExpense({ id: expenseId, expense: payload });
        } else {
          await createExpense(payload);
        }
        queryClient.invalidateQueries([GET_EXPENSES_KEY]);
        queryClient.invalidateQueries([GET_CATEGORIES_KEY]);
        resetForm();
        setShowNewCategoryInput(false);
        setNewCategoryName("");
        if (onCancel) onCancel();
      } catch (err) {
        console.error("Failed to submit form:", err);
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === "__new__") {
      setShowNewCategoryInput(true);
      formik.setFieldValue("category", "__new__");
    } else {
      setShowNewCategoryInput(false);
      formik.setFieldValue("category", val);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
      {/* Amount */}
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

      {/* Category */}
      <select
        name="category"
        value={showNewCategoryInput ? "__new__" : formik.values.category}
        onChange={handleCategoryChange}
        className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900"
      >
        <option value="">Select a category</option>
        <optgroup label="Common">
          {defaultCategoryNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Your Categories">
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </optgroup>
        <option value="__new__">+ Add new category</option>
      </select>
      {formik.touched.category && formik.errors.category && (
        <p className="text-red-500 text-sm">{formik.errors.category}</p>
      )}

      {/* New category input */}
      {showNewCategoryInput && (
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900 placeholder-gray-500"
        />
      )}

      {/* Date */}
      <input
        type="date"
        name="date"
        value={formik.values.date}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900"
      />
      {formik.touched.date && formik.errors.date && (
        <p className="text-red-500 text-sm">{formik.errors.date}</p>
      )}

      {/* Description */}
      <textarea
        placeholder="Description"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="cursor-pointer border px-3 py-2 w-full rounded text-gray-900 placeholder-gray-500"
      />
      {formik.touched.description && formik.errors.description && (
        <p className="text-red-500 text-sm">{formik.errors.description}</p>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          type="submit"
          className="cursor-pointer bg-blue-600 hover:opacity-90 text-white px-4 py-2 rounded"
          disabled={formik.isSubmitting}
        >
          {expenseId ? "Update Expense" : "Add Expense"}
        </button>
        {expenseId && onCancel && (
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
