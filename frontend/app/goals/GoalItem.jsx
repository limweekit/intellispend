"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGoal } from "./api.js";
import { GET_GOALS_KEY } from "../lib/constants.js";
import { useLoading } from "@/context/LoadingContext";
import { Edit2, Trash2 } from "lucide-react";
import CircularProgress from "./utils/CircularProgress";
import AdviceStreamer from "./utils/AdviceStreamer";


export default function GoalItem({ goal, onEdit }) {
  const queryClient = useQueryClient();
  const { setIsLoading } = useLoading();

  const deleteMut = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      await deleteGoal(goal.goal_id);
    },
    onSuccess: () => queryClient.invalidateQueries([GET_GOALS_KEY]),
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
        <div className="flex-shrink-0 mr-6"> 
          <CircularProgress percent={pct} />
        </div>
        <p className="text-lg font-medium text-gray-800">
          ${parseFloat(goal.current_progress).toFixed(2)} saved of ${parseFloat(goal.amount).toFixed(2)}
        </p>
      </div>

      {/* Deadline */}
      <p className="text-md text-gray-800">
          Due {new Date(goal.deadline).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
      </p>

      <AdviceStreamer goalId={goal.goal_id} />

      {/* Footer Actions */}
      <div className="pt-4 border-t flex items-center justify-between">
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
