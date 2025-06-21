"use client";

import React from "react";
import CalendarView from "./CalendarView";

export default function CalendarPage() {
  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Your Financial Calendar
          </h1>
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
