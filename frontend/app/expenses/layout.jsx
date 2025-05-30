import React from "react";

export const metadata = {
  title: "Expenses - IntelliSpend",
  description: "Track and manage your personal expenses",
};

export default function ExpensesLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}