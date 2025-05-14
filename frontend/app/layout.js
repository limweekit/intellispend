import Header from '../components/Header'
import Footer from '../components/Footer'
import './globals.css'

export const metadata = {
  title: 'IntelliSpend',
  description: 'Your AI-powered personal finance app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}