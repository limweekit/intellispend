"use client"
// all API calls related to expenses are made here
// const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`;
// const token = localStorage.getItem('access_token');

// export const getExpenses = async () => {
//     const res = await fetch(`${baseUrl}/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//     });
//     if (!res.ok) {
//       throw new Error('Failed to fetch expenses');
//     }
//     return res.json();
// }
//
// export const createExpense = async (expense) => {
//     const res = await fetch(`${baseUrl}/create`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(expense),
//     });
//     if (!res.ok) {
//         throw new Error('Failed to create expense');
//     }
//     return res.json();
// }
//
// export const updateExpense = async ({ id, expense }) => {
//     const res = await fetch(`${baseUrl}/update/${id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(expense),
//     });
//     if (!res.ok) {
//         throw new Error('Failed to update expense');
//     }
//     return res.json();
// }
//
// export const deleteExpense = async (id) => {
//     const res = await fetch(`${baseUrl}/delete/${id}`, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//     });
//     if (!res.ok) {
//         throw new Error('Failed to delete expense');
//     }
//     if (res.status === 204) {
//         return;
//     }
// }
//
// export const getExpenseById = async (id) => {
//     const res = await fetch(`${baseUrl}/${id}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//     });
//     if (!res.ok) {
//         throw new Error('Failed to fetch expense');
//     }
//     return res.json();
// }


const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/expenses`;
const getToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    console.log('Retrieved token:', token);
    return token;
  }
  console.log('Window undefined, cannot get token');
  return null;
};

export const getExpenses = async () => {
    const token = getToken();
    const res = await fetch(`${baseUrl}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return res.json();
}

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
    if (!res.ok) {
        throw new Error('Failed to create expense');
    }
    return res.json();
}

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
    if (!res.ok) {
        throw new Error('Failed to update expense');
    }
    return res.json();
}

export const deleteExpense = async (id) => {
    const token = getToken();
    const res = await fetch(`${baseUrl}/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error('Failed to delete expense');
    }
    if (res.status === 204) {
        return;
    }
}

export const getExpenseById = async (id) => {
    const token = getToken();
    const res = await fetch(`${baseUrl}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch expense');
    }
    return res.json();
}