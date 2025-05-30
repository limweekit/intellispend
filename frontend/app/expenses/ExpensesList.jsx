import ExpensesItem from "./ExpensesItem.jsx";

export default function ExpensesList({ expenses, categories, categoryColors }) {
  const list = expenses?.expenses || [];

  return (
    <div className="flex flex-col gap-4">
      {list.map((expense) => (
        <ExpensesItem
          key={expense.expense_id}
          expense={expense}
          categories={categories}
          categoryColors={categoryColors}
        />
      ))}
    </div>
  );
}
