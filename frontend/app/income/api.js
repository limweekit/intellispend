"use client";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/income`;
const categoriesUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`;

const getToken = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  return parsed.access || parsed.access_token || parsed.user?.access || null;
};

export async function getIncomes() {
  const token = getToken();
  const res = await fetch(`${baseUrl}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch incomes");
  return res.json();
}

export async function createIncome(income) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(income),
  });
  if (!res.ok) throw new Error("Failed to create income");
  return res.json();
}

export async function updateIncome({ id, income }) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(income),
  });
  if (!res.ok) throw new Error("Failed to update income");
  return res.json();
}

export async function deleteIncome(id) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete income");
  // 204 returns no content
}

export const getCategories = async (type) => {
  const token = getToken();
  const res = await fetch(`${categoriesUrl}/type/${type}/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export async function createCategory(name) {
  const token = getToken();
  const res = await fetch(`${categoriesUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}
