import './globals.css'
import React from 'react'
import { AuthProvider } from './(auth)/auth-provider'
import Header from '@/components/Header'

export const metadata = {
  title: 'Align',
  description: 'Personal discipline tracker'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
