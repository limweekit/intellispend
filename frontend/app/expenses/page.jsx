"use client"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { GET_EXPENSES_KEY, CREATE_EXPENSE_KEY, DELETE_EXPENSE_KEY, UPDATE_EXPENSE_KEY } from "../lib/constants.js";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "./api.js";
import { useState } from "react";
import ExpensesForm from "./ExpensesForm.jsx";
import ExpensesList from "./ExpensesList.jsx";

export default function ExpensesPage() {
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(true);

    const { data: expenses, isLoading, isError, isSuccess } = useQuery({
        queryKey: [GET_EXPENSES_KEY],
        queryFn: getExpenses,
    });

    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Create Expense</h1>
          <div className="p-4 border-b">
            <ExpensesForm
              initialData={null}
              expenseId={null}
              onCancel={() => setIsCreating(false)}
            />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your Expenses</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ExpensesList
              expenses={expenses}
            />
          )}
        </div>
    );
}