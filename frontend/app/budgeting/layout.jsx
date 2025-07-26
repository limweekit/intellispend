import React from "react";
import Spinner from "@/components/Spinner";
import { AuthContextProvider } from "@/context/AuthContext";
import { LoadingProvider } from "@/context/LoadingContext";

export const metadata = {
  title: "Budgeting - IntelliSpend",
  description: "Collaboratively track shared expenses and manage contributions",
};

export default function BudgetingLayout({ children }) {
  return (
    <AuthContextProvider>
      <LoadingProvider>
        <Spinner />
        <div className="min-h-screen bg-gray-100">
          <main className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </main>
        </div>
      </LoadingProvider>
    </AuthContextProvider>
  );
}
