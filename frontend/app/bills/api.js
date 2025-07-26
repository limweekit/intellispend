"use client";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/bills`;

const getToken = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.access_token || storedUser?.user?.access_token;
    if (typeof window !== 'undefined') {
      return token;
    }
  return null;
};

export const getBills = async () => {
  const token = getToken();
  const res = await fetch(`${baseUrl}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch bills');
  return res.json();
};

export const createBill = async (bill) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bill),
  });
  if (!res.ok) throw new Error('Failed to create bill');
  return res.json();
};

export const updateBill = async ({ id, bill }) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bill),
  });
  if (!res.ok) throw new Error('Failed to update bill');
  return res.json();
};

export const deleteBill = async (id) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete bill');
  if (res.status === 204) return;
};


export const getBillById = async (id) => {
  const token = getToken();
  const res = await fetch(`${baseUrl}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch bill');
  return res.json();
};
