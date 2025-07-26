import { useQueryClient } from "@tanstack/react-query";
import { deleteBill } from "./api.js";
import { GET_BILLS_KEY } from "../lib/constants.js";
import { useState } from "react";
import BillsForm from "./BillsForm.jsx";

export default function BillsItem({
  bill,
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
      await deleteBill(bill.id);
      queryClient.invalidateQueries([GET_BILLS_KEY]);
    } catch (error) {
      console.error("Failed to delete bill:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return isEditing ? (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <BillsForm
        initialData={bill}
        billId={bill.id}
        onCancel={handleCancel}
      />
    </div>
  ) : (
    <div
      className="flex justify-between items-center bg-white rounded-lg shadow p-4 mb-4 transform transition-transform hover:shadow-lg hover:-translate-y-1"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {bill.name}
        </h3>
        <p className="text-gray-600">Amount: ${bill.amount}</p>
        <p className="text-gray-600">Due Date: {bill.due_date}</p>
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
