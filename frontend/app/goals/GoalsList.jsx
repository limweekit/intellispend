"use client";

import React from "react";
import GoalItem from "./GoalItem.jsx";

export default function GoalsList({ goals, categoryColors }) {
  const list = goals?.goals || [];
  if (list.length === 0) {
    return <p className="text-center text-gray-500">No goals yet.</p>;
  }
  return (
    <div className="space-y-4">
      {list.map((goal) => (
        <GoalItem
          key={goal.goal_id}
          goal={goal}
        />
      ))}
    </div>
  );
}
