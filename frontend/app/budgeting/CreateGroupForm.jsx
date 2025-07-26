'use client';

import { useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/app/lib/api';
import { AuthContext } from '@/context/AuthContext';

export default function CreateGroupForm({ onCancel }) {
  const { currentUser, authLoaded } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  // once we know who’s logged in, pre-select them
  useEffect(() => {
    if (authLoaded && currentUser) {
      setSelected([currentUser.user]);
    }
  }, [authLoaded, currentUser]);

  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => API.get('/users').then(r => r.data.users),
    enabled: authLoaded,
  });

  // Mutation to create the group
  const createGroup = useMutation({
    mutationFn: data => API.post('/budgeting/groups/create', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setName('');
      setSearch('');
      setResults([]);
      setSelected([currentUser.user]);
      onCancel();    // close the form
    },
  });

  // Search for users to add
  const handleSearch = () => {
    const term = search.trim().toLowerCase();
    setResults(
      users.filter(u =>
        u.username.toLowerCase().includes(term) &&
        u.id !== currentUser.user.id &&
        !selected.some(m => m.id === u.id)
      )
    );
  };

  // Add a user to the selected list
  const addMember = (u) => {
    setSelected(prev => [...prev, u]);
    setResults(prev => prev.filter(x => x.id !== u.id));
  };

  // Remove a user from the selected list
  const removeMember = (id) => {
    setSelected(prev => prev.filter(u => u.id !== id));
  };

  if (!authLoaded) {
    return (
      <p className="p-6 text-center text-gray-600">Loading form…</p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 mt-8 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Create New Group
        </h2>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:opacity-90"
        >
          Cancel
        </button>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          createGroup.mutate({ name, members: selected.map(u => u.id) });
        }}
        className="space-y-4"
      >
        {/* Group Name */}
        <div>
          <label className="block mb-1 text-gray-700">Group Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border border-gray-300 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Member Search */}
        <div>
          <label className="block mb-1 text-gray-700">Add Members</label>
          <div className="flex">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search username"
              className="flex-grow border border-gray-300 text-gray-800 rounded-l px-3 py-2 focus:outline-none focus:ring"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:opacity-90"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <ul className="border border-gray-200 rounded overflow-hidden mb-4">
            {results.map(u => (
              <li
                key={u.id}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-50"
              >
                <span className="text-gray-800">{u.username}</span>
                <button
                  type="button"
                  onClick={() => addMember(u)}
                  className="text-blue-600 hover:underline"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Selected Members */}
        <div>
          <label className="block mb-1 text-gray-700">Members</label>
          <ul className="flex flex-wrap gap-2">
            {selected.map(u => (
              <li
                key={u.id}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1"
              >
                <span className="mr-2 text-gray-800">{u.username}</span>
                {u.id !== currentUser.user.id && (
                  <button
                    type="button"
                    onClick={() => removeMember(u.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            disabled={createGroup.isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            {createGroup.isLoading ? 'Creating…' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
}
