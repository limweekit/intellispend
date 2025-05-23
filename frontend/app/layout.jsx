// frontend/app/layout.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools }             from '@tanstack/react-query-devtools'

import Header             from '../components/Header'
import Footer             from '../components/Footer'
import Spinner            from '../components/Spinner'
import { AuthContextProvider, useAuth }  from '@/context/AuthContext'
import { LoadingProvider }               from '@/context/LoadingContext'

import './globals.css'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  const pathname = usePathname()

  // hide header/footer for login, register **and** home page
  const noLayoutPages = ['/login', '/register']
  const showLayout   = !noLayoutPages.includes(pathname)

  // decide whether we wrap in container
  const isHome = pathname === '/'

  return (
    <html lang="en">
      <body
        className={
          `min-h-screen flex flex-col ` +
          `${isHome ? 'bg-white' : 'bg-gray-50'} text-gray-900`
        }
      >
        <AuthContextProvider>
          <LoadingProvider>
            <QueryClientProvider client={queryClient}>
              <Spinner />

              {showLayout && <Header />}

              <main
                className={
                  'flex-grow ' +
                  (isHome ? '' : 'container mx-auto px-4 py-8')
                }
              >
                {children}
              </main>

              {showLayout && <Footer />}

              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </LoadingProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
