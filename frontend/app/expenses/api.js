"use client";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`;
const categoriesUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`;

const getToken = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.access_token || storedUser?.user?.access_token;
    if (typeof window !== 'undefined') {
      return token;
    }
  return null;
};

// Expenses endpoints
export const getExpenses = async () => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
};

export const createExpense = async (expense) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error('Failed to create expense');
  return res.json();
};

export const updateExpense = async ({ id, expense }) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error('Failed to update expense');
  return res.json();
};

export const deleteExpense = async (id) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete expense');
  if (res.status === 204) return;
};

// Categories endpoints
export const getCategories = async () => {
  const token = getToken();
  const res = await fetch(`${categoriesUrl}/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const createCategory = async (name) => {
  const token = getToken();
  const res = await fetch(`${categoriesUrl}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
};

export const getExpenseById = async (id) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch expense');
  return res.json();
};
