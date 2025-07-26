'use client';

import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import API from '@/app/lib/api';
import CreateGroupForm from './CreateGroupForm';

export default function BudgetGroupsPage() {
  const { authLoaded } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const {
    data: groups = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: () => API.get('/budgeting/groups').then(r => r.data.groups),
    enabled: authLoaded,
  });

  // Deletion mutation
  const deleteMutation = useMutation({
    mutationFn: (groupId) =>
      API.delete(`/budgeting/groups/delete/${groupId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  if (!authLoaded || isLoading) {
    return <p className="p-6 text-center text-gray-600">Loading groups…</p>;
  }
  if (isError) {
    return (
      <p className="p-6 text-center text-red-500">
        Error loading groups. Please try again.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Budget Groups
      </h1>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {group.name}
              </h2>
              <div className="flex justify-end space-x-2">
                <Link
                  href={`/budgeting/${group.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
                >
                  View Details
                </Link>

                <button
                  onClick={() => deleteMutation.mutate(group.id)}
                  disabled={deleteMutation.isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          You have no budget groups yet.
        </p>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:opacity-90"
        >
          + Create New Group
        </button>
      </div>

      {showForm && (
        <CreateGroupForm onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
}
