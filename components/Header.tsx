"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../app/(auth)/auth-provider'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Align
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Dashboard
              </Link>
              <Link href="/log" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Daily Log
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
