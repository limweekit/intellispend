'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/app/lib/api';
import { useLoading } from '@/context/LoadingContext'; 

export default function ExpenseForm({
  groupId,
  members,
  initialData = null,     
  onSuccess = () => {},   
  onCancel = () => {}    
}) {
  const queryClient = useQueryClient();
  const { setIsLoading } = useLoading();            
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});
  const [customError, setCustomError] = useState('');

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setAmount(initialData.amount.toString());
      setSplitType(initialData.split_type);
      setCustomSplits(initialData.splits || {});
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (payload) => {
      if (initialData) {
        return API.patch(
          `/budgeting/shared_expenses/update/${initialData.id}`,
          payload
        );
      } else {
        return API.post('/budgeting/shared_expenses/create', payload);
      }
    },
    onMutate: () => setIsLoading(true),              
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
      if (!initialData) {
        setDescription('');
        setAmount('');
        setSplitType('equal');
        setCustomSplits({});
        setCustomError('');
      }
      onSuccess();
    },
    onSettled: () => setIsLoading(false),              
  });

  const handleCustomChange = (memberId, value) => {
    setCustomSplits(prev => ({ ...prev, [memberId]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
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

    mutation.mutate({
      group: groupId,
      description,
      amount: parseFloat(amount),
      split_type: splitType,
      splits: splitType === 'custom' ? customSplits : {},
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {initialData ? 'Edit Expense' : 'Add Shared Expense'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block font-medium text-gray-700">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Split Type */}
        <div>
          <label className="block font-medium text-gray-700">Split Type</label>
          <select
            value={splitType}
            onChange={e => setSplitType(e.target.value)}
            className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2 focus:outline-none focus:ring"
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
                <label className="block text-gray-700">{member.username}</label>
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

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          {initialData && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:opacity-90"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={mutation.isLoading}
            className={`px-6 py-2 rounded-lg hover:opacity-90 ${
              initialData ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {mutation.isLoading
              ? initialData
                ? 'Updating…'
                : 'Adding…'
              : initialData
              ? 'Update'
              : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
