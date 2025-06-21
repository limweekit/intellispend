"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncome } from "./api.js";
import { GET_INCOMES_KEY } from "../lib/constants.js";
import IncomeForm from "./IncomeForm.jsx";

export default function IncomeItem({
  income,
  categories,
  categoryColors,
}) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing]   = useState(false);

  const handleEdit   = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const deleteMut = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      await deleteIncome(income.income_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([GET_INCOMES_KEY]);
    },
    onSettled: () => setIsDeleting(false),
  });

  const catObj = categories.find((c) => c.category_id === income.category);
  const categoryName = catObj ? catObj.name : "N/A";
  const borderColor  = categoryColors[income.category] || "#6B7280";

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <IncomeForm initialData={income} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div
      className="flex justify-between items-center bg-white rounded-lg shadow p-4 mb-4 transform transition-transform hover:shadow-lg hover:-translate-y-1"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{income.name}</h3>
        <p className="text-gray-600">Amount: ${income.amount}</p>
        <p className="text-gray-600">Date: {income.date}</p>
        <p className="text-gray-600">Category: {categoryName}</p>
      </div>
      <div className="flex space-x-4">
        <button onClick={handleEdit} className="text-blue-500 hover:underline">
          Edit
        </button>
        <button
          onClick={() => deleteMut.mutate()}
          disabled={isDeleting}
          className="text-red-500 hover:underline"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
