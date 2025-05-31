"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_EXPENSES_KEY, GET_CATEGORIES_KEY } from "../lib/constants.js";
import { getExpenses, getCategories } from "./api.js";
import ExpensesForm from "./ExpensesForm.jsx";
import ExpensesList from "./ExpensesList.jsx";

export default function ExpensesPage() {
  const [, setIsCreating] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("date_desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: [GET_EXPENSES_KEY],
    queryFn: getExpenses,
  });

  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: [GET_CATEGORIES_KEY],
    queryFn: getCategories,
  });

  const categories = categoriesData?.categories || [];

  if (loadingExpenses || loadingCategories) {
    return <p className="p-6 text-center text-gray-500">Loading...</p>;
  }

  // Color mapping
  const defaultColors = {
    Dining: "#10B981",
    Transport: "#F59E0B",
    Bills: "#3B82F6",
    Shopping: "#8B5CF6",
    Others: "#6B7280",
  };
  const extraPalette = [
    "#EF4444", "#6366F1", "#EC4899",
    "#14B8A6", "#84CC16", "#10B981",
  ];
  const categoryColors = {};
  let extraIndex = 0;
  categories.forEach((cat) => {
    if (defaultColors[cat.name]) {
      categoryColors[cat.category_id] = defaultColors[cat.name];
    } else {
      categoryColors[cat.category_id] =
        extraPalette[extraIndex++ % extraPalette.length];
    }
  });

  // Base expenses
  const allExpenses = expenses?.expenses || [];

  // Filter by category
  let filtered = selectedCategory
    ? allExpenses.filter((e) => e.category === selectedCategory)
    : allExpenses;

  // Filter by date range
  if (startDate) {
    filtered = filtered.filter(
      (e) => new Date(e.date) >= new Date(startDate)
    );
  }
  if (endDate) {
    filtered = filtered.filter(
      (e) => new Date(e.date) <= new Date(endDate)
    );
  }

  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((e) =>
      e.description.toLowerCase().includes(term)
    );
  }

  // Sort filtered expenses
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "date_asc":
        return new Date(a.date) - new Date(b.date);
      case "date_desc":
        return new Date(b.date) - new Date(a.date);
      case "amount_asc":
        return parseFloat(a.amount) - parseFloat(b.amount);
      case "amount_desc":
        return parseFloat(b.amount) - parseFloat(a.amount);
      default:
        return 0;
    }
  });

  // Summary metrics
  const total = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const average = filtered.length ? total / filtered.length : 0;
  const maximum = filtered.length
    ? Math.max(...filtered.map((e) => parseFloat(e.amount)))
    : 0;

  return (
    <div className="space-y-8">
      {/* Add Expense Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Expense
        </h2>
        <ExpensesForm
          initialData={null}
          expenseId={null}
          onCancel={() => setIsCreating(false)}
          categories={categories}
        />
      </section>

      {/* Summary Section */}
      <section className="flex gap-4">
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Expense Count</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {filtered.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Total Spent</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Average Expense</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${average.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Max Expense</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${maximum.toFixed(2)}
          </p>
        </div>
      </section>

      {/* Date Range Filter */}
      <section className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-gray-700 font-medium">
            From:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="endDate" className="text-gray-700 font-medium">
            To:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Filter, Search & Sort Bar */}
      <section className="flex items-center space-x-4">
        {/* Category Filter */}
        <div className="flex-1 min-w-0 overflow-x-auto flex space-x-4 py-2">
          <button
            className={`inline-block px-3 py-1 rounded-full font-medium flex-shrink-0 ${!selectedCategory ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              className={`inline-block px-3 py-1 rounded-full font-medium flex-shrink-0 ${selectedCategory === cat.category_id ? 'text-white' : 'text-gray-800'}`}
              style={{
                backgroundColor:
                  selectedCategory === cat.category_id
                    ? categoryColors[cat.category_id]
                    : '#F3F4F6',
                border: `2px solid ${categoryColors[cat.category_id]}`,
              }}
              onClick={() => setSelectedCategory(cat.category_id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-none w-64">
          <input
            type="text"
            placeholder="Search description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort By */}
        <div className="flex-none">
          <label htmlFor="sort" className="text-gray-700 font-medium mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="amount_desc">Amount (Highest)</option>
            <option value="amount_asc">Amount (Lowest)</option>
          </select>
        </div>
      </section>

      {/* Expenses List Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Your Expenses
        </h2>
        <ExpensesList
          expenses={{ expenses: filtered }}
          categories={categories}
          categoryColors={categoryColors}
        />
      </section>
    </div>
  );
}