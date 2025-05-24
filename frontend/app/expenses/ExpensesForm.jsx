import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createExpense, updateExpense } from './api.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function ExpensesForm({ initialData, expenseId, onCancel }) {
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState({});

    const formik = useFormik({
        initialValues: {
          amount: initialData?.amount || '',
          category: initialData?.category || '',
          description: initialData?.description || '',
          date: initialData?.date || '',
        },
        validationSchema: Yup.object({
          amount: Yup.number()
            .positive('Amount must be greater than 0')
            .required('Amount is required'),
          category: Yup.string(),
          description: Yup.string()
            .required('Description is required'),
          date: Yup.date()
            .required('Date is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
        try {
            const payload = {
              amount: values.amount,
              category: values.category,
              date: values.date,
              description: values.description,
            };

            if (expenseId) {
                await updateExpense({ id: expenseId, expense: payload });
                queryClient.invalidateQueries(['GET_EXPENSES']);
            } else {
                const newExpense = await createExpense(payload);
                await queryClient.invalidateQueries(['GET_EXPENSES']);
                await queryClient.refetchQueries(['GET_EXPENSES']);
            }
            if (onCancel) onCancel();
          } catch (err) {
              console.error('Failed to submit form:', err);
          } finally {
              setSubmitting(false);
          }
        }
    })

    // TODO: hardcoded category, refactor to use API call
    const categories = [
        { uuid: '23e1bc79-e470-4752-8e6f-bf53c22a62fc', name: 'Food' },
    ];

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border px-3 py-2 w-full"
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="text-red-500 text-sm">{formik.errors.amount}</p>
          )}
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            className="border px-3 py-2 w-full"
          >
          <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.uuid} value={cat.uuid}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border px-3 py-2 w-full"
          />
          {formik.touched.date && formik.errors.date && (
            <p className="text-red-500 text-sm">{formik.errors.date}</p>
          )}
          <textarea
            placeholder="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border px-3 py-2 w-full"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
          <div className="flex space-x-4">
            <button type="submit" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
                {initialData ? 'Update Expense' : 'Add Expense'}
            </button>
            {initialData && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
    );
}