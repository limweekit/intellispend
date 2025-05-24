import { useQueryClient } from '@tanstack/react-query';
import { updateExpense, deleteExpense } from './api.js';
import { useState } from 'react';
import ExpensesForm from './ExpensesForm.jsx';

export default function ExpensesItem({ expense }) {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);

        try {
            await deleteExpense(expense.expense_id);
            queryClient.invalidateQueries(['GET_EXPENSES']);
        } catch (error) {
            console.error('Failed to delete expense:', error);
        } finally {
            setIsDeleting(false);
        }
    }

    // TODO: make API call to get category by ID and return the name

    return isEditing ? (
        <div className="p-4 border-b">
          <ExpensesForm
            initialData={expense}
            expenseId={expense.expense_id}
            onCancel={handleCancel}
          />
        </div>
    ) : (
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{expense.description}</h3>
            <p className="text-gray-600">{expense.amount}</p>
            <p className="text-gray-600">{expense.date}</p>
            <p className="text-gray-600">{expense.category}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleEdit}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
    )
}
