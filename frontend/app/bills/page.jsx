"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_BILLS_KEY } from "../lib/constants.js";
import { getBills } from "./api.js";
import BillsForm from "./BillsForm.jsx";
import BillsList from "./BillsList.jsx";
import { useLoading } from "@/context/LoadingContext";

export default function BillsPage() {
  const [, setIsCreating] = useState(true);
  const [sortBy, setSortBy] = useState("date_desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { setIsLoading } = useLoading();

  const { data: bills, isLoading: loadingBills } = useQuery({
    queryKey: [GET_BILLS_KEY],
    queryFn: getBills,
  });


  useEffect(() => {
    if (loadingBills) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingBills, setIsLoading]);


  // Base bills
  const allBills = bills?.bills || [];


  // Filter by date range
  let filtered= [...allBills];
  if (startDate) {
    filtered = filtered.filter(
      (e) => new Date(e.due_date) >= new Date(startDate)
    );
  }
  if (endDate) {
    filtered = filtered.filter(
      (e) => new Date(e.due_date) <= new Date(endDate)
    );
  }

  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((e) =>
      e.name.toLowerCase().includes(term)
    );
  }

  // Sort filtered bills
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "date_asc":
        return new Date(a.due_date) - new Date(b.due_date);
      case "date_desc":
        return new Date(b.due_date) - new Date(a.due_date);
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

  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  const getToken = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.access_token || storedUser?.user?.access_token;
    if (typeof window !== 'undefined') {
      return token;
    }
    return null;
  };

  const sendEmailReminders = async () => {
    const token = getToken();
    if (!token) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/bills/test-reminder/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
        throw new Error('Failed to send email reminders');
    }
  }

  return (
    <div className="space-y-8">
      {/* Add Bill Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Bill
          </h2>
          <button
            onClick={sendEmailReminders}
            className="cursor-pointer bg-blue-600 hover:opacity-90 text-white px-4 py-2 rounded"
            type="submit"
          >
            Send Email Reminders
          </button>
        </div>
        <BillsForm
          initialData={null}
          billId={null}
          onCancel={() => setIsCreating(false)}
        />
      </section>

      {/* Summary Section */}
      <section className="flex gap-4">
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Bill Count</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {filtered.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Total Bills</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Average Bill</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            ${average.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-2 text-center flex-1">
          <h3 className="text-lg font-medium text-gray-700">Highest Bill</h3>
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

      {/* Bills List Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Your Bills
        </h2>
        <BillsList
          bills={{ bills: filtered }}
        />
      </section>
    </div>
  );
}