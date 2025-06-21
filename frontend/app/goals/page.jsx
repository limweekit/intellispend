"use client";

import React, { useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_GOALS_KEY } from "../lib/constants.js";
import { getGoals } from "./api.js";
import GoalItem from "./GoalItem.jsx";
import GoalForm from "./GoalForm.jsx";

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_GOALS_KEY],
    queryFn: getGoals,
    refetchOnWindowFocus: true,
  });

  const openCreate = () => {
    setSelectedGoal(null);
    setShowForm(true);
  };

  const openEdit = (goal) => {
    setSelectedGoal(goal);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <p className="p-6 text-center text-gray-600">Loading goals…</p>
    );
  }

  if (isError) {
    return (
      <p className="p-6 text-center text-red-500">
        Error loading goals. Please try again.
      </p>
    );
  }

  const goals = (data?.goals || []).slice().sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Goals</h1>

      {/* Inline form (create or edit) */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-800 font-semibold">
              {selectedGoal
                ? "Edit Goal"
                : goals.length > 0
                ? "Add New Goal"
                : "Create Your First Goal"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
            >
              Cancel
            </button>
          </div>
          <GoalForm
            initialData={selectedGoal || {}}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Empty state */}
      {!goals.length && !showForm && (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            You have not set up any goals yet.
          </p>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            + Add Your First Goal
          </button>
        </div>
      )}

      {/* Goals list */}
      {goals.length > 0 && !showForm && (
        <div className="space-y-4">
          {/* Add another */}
          <div className="flex justify-end mb-4">
            <button
              onClick={openCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
            >
              Add Goal
            </button>
          </div>

          {goals.map((goal) => (
            <GoalItem
              key={goal.goal_id}
              goal={goal}
              onEdit={() => openEdit(goal)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
