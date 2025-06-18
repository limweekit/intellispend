"use client";

import React from "react";
import IncomeItem from "./IncomeItem.jsx";

export default function IncomesList({ incomes, categories, categoryColors }) {
  const list = incomes?.incomes || [];
  if (list.length === 0) {
    return <p className="text-center text-gray-500">No income entries yet.</p>;
  }
  return (
    <div className="space-y-4">
      {list.map((inc) => (
        <IncomeItem
          key={inc.income_id}
          income={inc}
          categories={categories}
          categoryColors={categoryColors}
        />
      ))}
    </div>
  );
}
