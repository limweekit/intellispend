import ExpensesItem from "./ExpensesItem"

export default function ExpensesList({ expenses }) {
    const res = expenses?.expenses;

    return (
        <div className="flex flex-col gap-4">
            {res?.map((expense) => (
                <ExpensesItem expense={expense} />
            ))}
        </div>
    )
}