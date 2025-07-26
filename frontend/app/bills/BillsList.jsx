import BillsItem from "./BillsItem.jsx";

export default function BillsList({ bills }) {
  const list = bills?.bills || [];

  return (
    <div className="flex flex-col gap-4">
      {list.map((bill) => (
        <BillsItem
          key={bill.id}
          bill={bill}
        />
      ))}
    </div>
  );
}
