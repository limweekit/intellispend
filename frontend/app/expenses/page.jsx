"use client"
import { useQuery } from "@tanstack/react-query";
import { GET_EXPENSES_KEY } from "../lib/constants.js";
import { getExpenses } from "./api.js";
import { useState } from "react";
import ExpensesForm from "./ExpensesForm.jsx";
import ExpensesList from "./ExpensesList.jsx";

export default function ExpensesPage() {
    const [, setIsCreating] = useState(true);

    const { data: expenses, isLoading } = useQuery({
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