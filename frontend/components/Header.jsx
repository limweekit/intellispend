import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-semibold cursor-pointer"
        >
          IntelliSpend
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/expenses" className="hover:text-blue-600">
            Expenses
          </Link>
        </nav>
      </div>
    </header>
  )
}
