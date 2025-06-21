import { useQueryClient } from "@tanstack/react-query";
import { updateExpense, deleteExpense } from "./api.js";
import { GET_EXPENSES_KEY } from "../lib/constants.js";
import { useState } from "react";
import ExpensesForm from "./ExpensesForm.jsx";

export default function ExpensesItem({
  expense,
  categories = [],
  categoryColors = {},
}) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteExpense(expense.expense_id);
      queryClient.invalidateQueries([GET_EXPENSES_KEY]);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Look up category name and color
  const catObj = categories.find((c) => c.category_id === expense.category);
  const categoryName = catObj ? catObj.name : expense.category || "N/A";
  const borderColor = categoryColors[expense.category] || "#6B7280"; // gray-500 fallback

  return isEditing ? (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <ExpensesForm
        initialData={expense}
        expenseId={expense.expense_id}
        onCancel={handleCancel}
        categories={categories}
      />
    </div>
  ) : (
    <div
      className="flex justify-between items-center bg-white rounded-lg shadow p-4 mb-4 transform transition-transform hover:shadow-lg hover:-translate-y-1"
      style={{
        borderLeft: `5px solid ${borderColor}`,
      }}
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {expense.description}
        </h3>
        <p className="text-gray-600">Amount: ${expense.amount}</p>
        <p className="text-gray-600">Date: {expense.date}</p>
        <p className="text-gray-600">Category: {categoryName}</p>
      </div>
      <div className="flex space-x-4">
        <button onClick={handleEdit} className="text-blue-500 hover:underline">
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:underline"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
