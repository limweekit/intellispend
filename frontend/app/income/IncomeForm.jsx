"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createIncome, updateIncome, createCategory } from "./api.js";
import { GET_INCOMES_KEY, GET_CATEGORIES_KEY } from "../lib/constants.js";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function IncomeForm({ initialData = {}, onCancel }) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialData.income_id);

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Pull existing categories from cache
  const cachedCats =
    queryClient.getQueryData([GET_CATEGORIES_KEY])?.categories || [];

  const formik = useFormik({
    initialValues: {
      name:            initialData.name     || "",
      amount:          initialData.amount   || "",
      category:        initialData.category || "",
      date:            initialData.date     || "",
      newCategoryName: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      amount: Yup.number()
        .positive("Must be > 0")
        .required("Amount is required"),
      category: Yup.string(),
      newCategoryName: Yup.string(),
      date: Yup.date().required("Date is required"),
    })
   
    .test(
      "category-or-new",
      "You must select an existing category or enter a new one",
      ({ category, newCategoryName }) => {
        return Boolean(category) || Boolean(newCategoryName?.trim());
      }
    ),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      let categoryId = values.category;

      // If creating a new category
      if (showNewCategoryInput) {
        const name = values.newCategoryName.trim();
        try {
          const res = await createCategory(name);
          categoryId = res.category.category_id;
        } catch {
          formik.setFieldError(
            "newCategoryName",
            "Failed to create category"
          );
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        name:     values.name,
        amount:   values.amount,
        category: categoryId,
        date:     values.date,
      };

      try {
        if (isEdit) {
          await updateIncome({ id: initialData.income_id, income: payload });
        } else {
          await createIncome(payload);
        }
        queryClient.invalidateQueries([GET_INCOMES_KEY]);
        queryClient.invalidateQueries([GET_CATEGORIES_KEY]);
        resetForm();
        setShowNewCategoryInput(false);
        if (onCancel) onCancel();
      } catch (err) {
        console.error("Income submit error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === "__new__") {
      setShowNewCategoryInput(true);
      formik.setFieldValue("category", "");
      formik.setFieldValue("newCategoryName", "");
    } else {
      setShowNewCategoryInput(false);
      formik.setFieldValue("category", val);
      formik.setFieldValue("newCategoryName", "");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 mb-4">
      {/* Name */}
      <input
        name="name"
        type="text"
        placeholder="Source (e.g. Salary)"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border px-3 py-2 w-full rounded text-gray-900"
      />
      {formik.touched.name && formik.errors.name && (
        <p className="text-red-500 text-sm">{formik.errors.name}</p>
      )}

      {/* Amount */}
      <input
        name="amount"
        type="number"
        step="0.01"
        placeholder="Amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border px-3 py-2 w-full rounded text-gray-900"
      />
      {formik.touched.amount && formik.errors.amount && (
        <p className="text-red-500 text-sm">{formik.errors.amount}</p>
      )}

      {/* Category Dropdown */}
      <select
        name="category"
        value={showNewCategoryInput ? "__new__" : formik.values.category}
        onChange={handleCategoryChange}
        className="border px-3 py-2 w-full rounded text-gray-900"
      >
        <option value="">Select a category</option>
        <optgroup label="Your Categories">
          {cachedCats.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </optgroup>
        <option value="__new__">+ Add new category</option>
      </select>

      {/* New Category Input */}
      {showNewCategoryInput && (
        <>
          <input
            name="newCategoryName"
            type="text"
            placeholder="New category name"
            value={formik.values.newCategoryName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border px-3 py-2 w-full rounded text-gray-900"
          />
        </>
      )}
      
      {(formik.touched.category || formik.touched.newCategoryName) && formik.errors["category-or-new"] && (
        <p className="text-red-500 text-sm">
          {formik.errors["category-or-new"]}
        </p>
      )}

      {/* Date */}
      <input
        name="date"
        type="date"
        value={formik.values.date}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border px-3 py-2 w-full rounded text-gray-900"
      />
      {formik.touched.date && formik.errors.date && (
        <p className="text-red-500 text-sm">{formik.errors.date}</p>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
        >
          {isEdit ? "Update Income" : "Add Income"}
        </button>
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
