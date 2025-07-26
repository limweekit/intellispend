'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/app/lib/api';

export default function ExpenseForm({ groupId, members }) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});
  const [customError, setCustomError] = useState('');

  const addExpense = useMutation({
    mutationFn: data => API.post('/budgeting/shared_expenses/create', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
      setDescription('');
      setAmount('');
      setSplitType('equal');
      setCustomSplits({});
      setCustomError('');
    },
  });

  const handleCustomChange = (memberId, value) => {
    setCustomSplits(prev => ({ ...prev, [memberId]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Validate custom splits
    if (splitType === 'custom') {
      const total = Object.values(customSplits).reduce(
        (sum, v) => sum + parseFloat(v || 0),
        0
      );
      if (Math.abs(total - 100) > 0.01) {
        setCustomError('Custom splits must sum to 100%');
        return;
      }
      setCustomError('');
    }

    addExpense.mutate({
      group: groupId,
      description,
      amount: parseFloat(amount),
      split_type: splitType,
      splits: splitType === 'custom' ? customSplits : {},
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Add Shared Expense
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-300 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Split Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Split Type
          </label>
          <select
            value={splitType}
            onChange={e => setSplitType(e.target.value)}
            className="w-full border border-gray-300 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
          >
            <option value="equal">Equal</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Custom Splits */}
        {splitType === 'custom' && (
          <div className="space-y-2">
            <p className="text-gray-700">Enter each member’s share (%):</p>
            {members.map(member => (
              <div key={member.id}>
                <label className="block font-medium text-gray-700 mb-1">
                  {member.username}
                </label>
                <input
                  type="number"
                  value={customSplits[member.id] || ''}
                  onChange={e => handleCustomChange(member.id, e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  className="w-full border border-gray-300 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
                />
              </div>
            ))}
            {customError && (
              <p className="text-red-500 text-sm">{customError}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={addExpense.isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            {addExpense.isLoading ? 'Adding…' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
