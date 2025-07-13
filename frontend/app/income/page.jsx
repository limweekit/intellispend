"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  GET_INCOMES_KEY,
  GET_CATEGORIES_KEY,
} from "../lib/constants.js";
import {
  getIncomes,
  getCategories,
} from "./api.js";
import IncomeForm from "./IncomeForm.jsx";
import IncomesList from "./IncomesList.jsx";
import { useLoading } from "@/context/LoadingContext";

export default function IncomePage() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy]               = useState("date_desc");
  const [startDate, setStartDate]         = useState("");
  const [endDate, setEndDate]             = useState("");
  const [searchTerm, setSearchTerm]       = useState("");
  const { setIsLoading } = useLoading();

  const {
    data: incomesData,
    isLoading: loadingIncomes,
  } = useQuery({
    queryKey: [GET_INCOMES_KEY],
    queryFn: getIncomes,
  });

  const {
    data: categoriesData,
    isLoading: loadingCategories,
  } = useQuery({
    queryKey: [GET_CATEGORIES_KEY, "income"],
    queryFn: () => getCategories("income"),
  });

  // tie spinner to initial fetches
  useEffect(() => {
    setIsLoading(loadingIncomes || loadingCategories);
  }, [loadingIncomes, loadingCategories, setIsLoading]);

  if (loadingIncomes || loadingCategories) return null;

  const incomes    = incomesData?.incomes || [];
  const categories = categoriesData?.categories || [];

  // Category colour mapping
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

  // Filtering
  let filtered = selectedCategory
    ? incomes.filter((i) => i.category === selectedCategory)
    : incomes;

  if (startDate) {
    filtered = filtered.filter((i) => new Date(i.date) >= new Date(startDate));
  }
  if (endDate) {
    filtered = filtered.filter((i) => new Date(i.date) <= new Date(endDate));
  }
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((i) =>
      i.name.toLowerCase().includes(term)
    );
  }

  // Sorting
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
  const total   = filtered.reduce((sum, i) => sum + parseFloat(i.amount), 0);
  const average = filtered.length ? total / filtered.length : 0;
  const maximum = filtered.length
    ? Math.max(...filtered.map((i) => parseFloat(i.amount)))
    : 0;
  const count   = filtered.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-gray-800 font-bold">Your Income</h1>
        <button
          onClick={() => setIsCreating((c) => !c)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          {isCreating ? "Cancel" : "Add Income"}
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <section className="bg-white rounded-lg shadow p-6">
          <IncomeForm onCancel={() => setIsCreating(false)} />
        </section>
      )}

      {/* Summary */}
      <section className="flex gap-4">
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Income Count</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {count}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Total Income</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Average Income</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${average.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Highest Income</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${maximum.toFixed(2)}
          </p>
        </div>
      </section>

      {/* Date Range */}
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
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Filters / Search / Sort */}
      <section className="flex items-center space-x-4">
        {/* Category Filter */}
        <div className="flex-1 min-w-0 overflow-x-auto flex space-x-4 py-2">
          <button
            className={`cursor-pointer inline-block px-3 py-1 rounded-full font-medium flex-shrink-0 ${
              !selectedCategory
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              className={`cursor-pointer inline-block px-3 py-1 rounded-full font-medium flex-shrink-0 ${
                selectedCategory === cat.category_id
                  ? 'text-white'
                  : 'text-gray-800'
              }`}
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
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort */}
        <div className="flex-none">
          <label htmlFor="sort" className="text-gray-700 font-medium mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="amount_desc">Amount (Highest)</option>
            <option value="amount_asc">Amount (Lowest)</option>
          </select>
        </div>
      </section>

      {/* List */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Income Entries
        </h2>
        <IncomesList
          incomes={{ incomes: filtered }}
          categories={categories}
          categoryColors={categoryColors}
        />
      </section>
    </div>
  );
}
