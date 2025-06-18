"use client";

const baseUrl   = `${process.env.NEXT_PUBLIC_API_BASE_URL}/goals`;
const adviceUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/insights/advice`;

function getToken() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  return parsed.access_token || parsed.access || parsed.user?.access_token || null;
}

// Fetch all goals
export async function getGoals() {
  const token = getToken();
  const res = await fetch(`${baseUrl}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch goals");
  return res.json();
}

// Create a goal
export async function createGoal(goal) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  return res.json();
}

// Update a goal
export async function updateGoal({ id, goal }) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error("Failed to update goal");
  return res.json();
}

// Delete a goal
export async function deleteGoal(id) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete goal");
}

// Refresh advice for one goal
export async function getGoalAdvice(goalId) {
  const token = getToken();
  const res = await fetch(`${adviceUrl}/${goalId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch advice");
  return res.json();
}
