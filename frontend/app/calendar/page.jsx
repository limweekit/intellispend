"use client";

import React, { useCallback } from "react";
import CalendarView from "./CalendarView";

export default function CalendarPage() {
  const handleExport = useCallback(async () => {
    try {
      let token = null;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) {
          const p = JSON.parse(stored);
          token = p.access_token || p.access || p.user?.access_token || null;
        }
      }
      if (!token) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/exports/download_csv`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to export: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "financial_calendar.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, []);

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Your Financial Calendar
          </h1>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Export as CSV</span>
          </button>
        </div>
        <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden border border-gray-400">
          <CalendarView />
        </div>
      </div>

      <style jsx global>{`
        .fc .fc-toolbar-title {
          color: #111827 !important;
          font-weight: 800 !important;
        }
      `}</style>
    </>
  );
}
