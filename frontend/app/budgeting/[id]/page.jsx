'use client';

import { useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/app/lib/api';
import { AuthContext } from '@/context/AuthContext';
import { useLoading } from '@/context/LoadingContext';        
import ExpenseForm from '../ExpenseForm';

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setIsLoading } = useLoading();                      
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const { currentUser, authLoaded } = useContext(AuthContext);


  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => API.get('/users').then(r => r.data.users),
    enabled: authLoaded,
  });

  // Fetch group
  const { data: group, isLoading: loadingGroup, isError: errorGroup } = useQuery({
    queryKey: ['group', id],
    queryFn: () => API.get(`/budgeting/groups/${id}`).then(r => r.data.group),
    enabled: authLoaded,
  });

  // Fetch expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', id],
    queryFn: () =>
      API.get(`/budgeting/groups/${id}/shared_expenses`).then(r => r.data.expenses),
    enabled: authLoaded,
  });

  // Mutations
  const renameMutation = useMutation({
    mutationFn: name => API.patch(`/budgeting/groups/update/${id}`, { name }),
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      setEditingName(false);
    },
    onSettled: () => setIsLoading(false),
  });

  const addMemberMutation = useMutation({
    mutationFn: uid =>
      API.post(`/budgeting/groups/add_member/${id}`, { user_id: uid }),
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      setMemberSearch('');
      setMemberResults([]);
    },
    onSettled: () => setIsLoading(false),
  });

  const removeMemberMutation = useMutation({
    mutationFn: uid =>
      API.post(`/budgeting/groups/remove_member/${id}`, { user_id: uid }),
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] });
    },
    onSettled: () => setIsLoading(false),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: expenseId =>
      API.delete(`/budgeting/shared_expenses/delete/${expenseId}`),
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', id] });
    },
    onSettled: () => setIsLoading(false),
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ expenseId, data }) =>
      API.patch(`/budgeting/shared_expenses/update/${expenseId}`, data),
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', id] });
      setEditingExpense(null);
    },
    onSettled: () => setIsLoading(false),
  });

  if (!authLoaded || loadingGroup) {
    return <p className="p-6 text-center text-gray-600">Loading…</p>;
  }
  if (errorGroup) {
    return <p className="p-6 text-center text-red-500">Error loading group.</p>;
  }

  // Build member objects array
  const memberObjs = group.members
    .map(uid => users.find(u => u.id === uid))
    .filter(Boolean);

  // Calculate total owed per member
  const totals = memberObjs.reduce((acc, m) => {
    acc[m.id] = 0;
    return acc;
  }, {});
  expenses.forEach(exp => {
    if (exp.split_type === 'equal') {
      const share = exp.amount / memberObjs.length;
      memberObjs.forEach(m => {
        totals[m.id] += share;
      });
    } else {
      Object.entries(exp.splits).forEach(([uid, pct]) => {
        const idNum = Number(uid);
        totals[idNum] += (exp.amount * Number(pct)) / 100;
      });
    }
  });

  // Member search
  const handleSearchMembers = () => {
    const term = memberSearch.toLowerCase().trim();
    setMemberResults(
      users.filter(
        u =>
          u.username.toLowerCase().includes(term) &&
          !group.members.includes(u.id)
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push('/budgeting')}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to Groups
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          {!editingName ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
              <button
                onClick={() => {
                  setNewName(group.name);
                  setEditingName(true);
                }}
                className="text-blue-600 hover:underline"
              >
                Rename
              </button>
            </>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                renameMutation.mutate(newName);
              }}
              className="flex space-x-2"
            >
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingName(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:opacity-90"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Totals Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Total Owed
        </h2>
        <ul className="space-y-2">
          {memberObjs.map(m => (
            <li key={m.id} className="text-gray-800">
              {m.username}: ${totals[m.id].toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Members */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Members</h2>
        <ul className="flex flex-wrap gap-2 mb-4">
          {memberObjs.map(u => {
            return (
              <li key={u.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <span className="mr-2 text-gray-800">{u.username}</span>
                {u.id !== currentUser.user.id && (
                  <button
                    onClick={() => removeMemberMutation.mutate(u.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex space-x-2">
          <input
            value={memberSearch}
            onChange={e => setMemberSearch(e.target.value)}
            placeholder="Search users"
            className="flex-grow border border-gray-300 text-gray-800 rounded-l px-3 py-2 focus:outline-none focus:ring"
          />
          <button
            onClick={handleSearchMembers}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:opacity-90"
          >
            Search
          </button>
        </div>
        {memberResults.length > 0 && (
          <ul className="mt-2 border border-gray-200 rounded overflow-hidden">
            {memberResults.map(u => (
              <li
                key={u.id}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-50"
              >
                <span className="text-gray-800">{u.username}</span>
                <button
                  onClick={() => addMemberMutation.mutate(u.id)}
                  className="text-blue-600 hover:underline"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Shared Expenses
          </h2>
          <p className="text-gray-600">
            {expenses.length} item{expenses.length !== 1 && 's'}
          </p>
        </div>
        <div className="space-y-4">
          {expenses.map(exp => {
            const creator = users.find(u => u.id === exp.created_by);
            const equalShare = (exp.amount / memberObjs.length).toFixed(2);
            return (
              <div
                key={exp.id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    {exp.description}
                  </span>
                  <span className="font-semibold text-gray-800">
                    ${exp.amount}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  By {creator?.username}
                </div>
                {exp.split_type === 'equal' ? (
                  <div className="mt-2 text-gray-800">
                    Each pays: ${equalShare}
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="text-gray-800">Custom Splits:</span>
                    <ul className="mt-1 ml-4 list-disc list-inside">
                      {Object.entries(exp.splits).map(([uid, pct]) => {
                        const u = users.find(x => x.id === +uid);
                        const share = (
                          (exp.amount * Number(pct)) /
                          100
                        ).toFixed(2);
                        return (
                          <li key={uid} className="text-gray-800">
                            {u?.username}: ${share}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Edit & Delete actions */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setEditingExpense(exp)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:opacity-90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpenseMutation.mutate(exp.id)}
                    disabled={deleteExpenseMutation.isLoading}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline Edit Expense Form */}
      {editingExpense && (
        <ExpenseForm
          groupId={id}
          members={memberObjs}
          initialData={editingExpense}
          onCancel={() => setEditingExpense(null)}
          onSuccess={() => setEditingExpense(null)}
        />
      )}

      {/* Add Expense */}
      {!editingExpense && (<ExpenseForm groupId={id} members={memberObjs} />)}
    </div>
  );
}
