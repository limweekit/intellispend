'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Tag, Target } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = storedUser?.access_token || storedUser?.user?.access_token;
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const handlePrimary = () => {
    router.push('/expenses')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-400 flex-grow flex flex-col">
        <main className="container mx-auto px-4 flex flex-col items-center justify-center text-center flex-grow">
          <h2 className="text-5xl font-extrabold text-white">
            Manage Your Finances Effortlessly
          </h2>
          <p className="mt-4 text-xl text-white max-w-2xl">
            Let us help you categorize expenses, set budgets, and track goals—all
            in one place.
          </p>
          <button
            onClick={handlePrimary}
            className="cursor-pointer mt-8 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition"
          >
            Track Your Expenses
          </button>
        </main>
      </div>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl text-gray-800 font-bold text-center mb-16">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Smart Budgeting */}
            <div className="flex flex-col items-center text-center">
              <Zap className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-xl text-gray-800 font-semibold mb-2">
                Smart Budgeting
              </h4>
              <p className="text-gray-600">
                AI-powered budgeting that adapts to your spending habits.
              </p>
            </div>

            {/* Expense Categorization */}
            <div className="flex flex-col items-center text-center">
              <Tag className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-xl text-gray-800 font-semibold mb-2">
                Expense Categorization
              </h4>
              <p className="text-gray-600">
                Automatically sorts your transactions into categories for easy filtering.
              </p>
            </div>

            {/* Goal Tracking */}
            <div className="flex flex-col items-center text-center">
              <Target className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-xl text-gray-800 font-semibold mb-2">
                Goal Tracking
              </h4>
              <p className="text-gray-600">
                Set savings goals and watch your progress in real time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
