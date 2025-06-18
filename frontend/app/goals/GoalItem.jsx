"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGoal, getGoalAdvice } from "./api.js";
import { GET_GOALS_KEY } from "../lib/constants.js";
import { useLoading } from "@/context/LoadingContext";
import { Edit2, Trash2, Lightbulb } from "lucide-react";

// circular progress bar
function CircularProgress({ percent, size = 120, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2563EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {/* Percentage label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-medium text-gray-700">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}

export default function GoalItem({ goal, onEdit }) {
  const queryClient = useQueryClient();
  const { setIsLoading } = useLoading();
  const [showAdvice, setShowAdvice] = useState(false);

  const deleteMut = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      await deleteGoal(goal.goal_id);
    },
    onSuccess: () => queryClient.invalidateQueries([GET_GOALS_KEY]),
    onSettled: () => setIsLoading(false),
  });

  const adviceMut = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      return getGoalAdvice(goal.goal_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([GET_GOALS_KEY]);
      setShowAdvice(true);
    },
    onSettled: () => setIsLoading(false),
  });

  const pct =
    goal.current_progress && goal.amount
      ? Math.min(
          100,
          (parseFloat(goal.current_progress) / parseFloat(goal.amount)) * 100
        )
      : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 transition-transform transform hover:shadow-lg hover:-translate-y-1">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{goal.name}</h3>
      </div>

      {/* Circular Progress + Amount */}
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-6 transform -translate-x-4"> {/* skew left */}
          <CircularProgress percent={pct} />
        </div>
        <p className="text-lg font-medium text-gray-800">
          ${parseFloat(goal.current_progress).toFixed(2)} saved of ${parseFloat(goal.amount).toFixed(2)}
        </p>
      </div>

      {/* Deadline */}
      <p className="text-sm text-gray-600">
        Due {new Date(goal.deadline).toLocaleDateString()}
      </p>

      {/* Advice List */}
      {showAdvice && goal.recommended_actions?.length > 0 && (
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          {goal.recommended_actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}

      {/* Footer Actions */}
      <div className="pt-4 border-t flex items-center justify-between">
        <button
          onClick={() => adviceMut.mutate()}
          disabled={adviceMut.isLoading}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:opacity-90"
        >
          <Lightbulb className="w-6 h-6 text-white" />
          <span>Get Advice</span>
        </button>
        <div className="flex space-x-4">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:underline flex items-center space-x-1"
          >
            <Edit2 className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => deleteMut.mutate()}
            disabled={deleteMut.isLoading}
            className="text-red-500 hover:underline flex items-center space-x-1"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
