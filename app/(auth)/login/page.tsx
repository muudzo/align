"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { normalizeEmail, isValidEmail } from '@/lib/validators'
import { useAuth } from '../auth-provider'

export default function LoginPage() {
  const router = useRouter()
  const { session, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && session) {
      router.push('/dashboard')
    }
  }, [session, authLoading, router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Normalize email - trim whitespace and convert to lowercase
    const normalizedEmail = normalizeEmail(email)

    // Basic validation
    if (!normalizedEmail || !password.trim()) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Email format validation
    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
        email: normalizedEmail, 
        password 
      })

      if (loginError) {
        // Provide user-friendly error messages
        if (loginError.message.includes('Invalid login credentials') || loginError.message.includes('Email not confirmed')) {
          setError('Invalid email or password. Please check your credentials or confirm your email if required.')
        } else if (loginError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.')
        } else {
          setError(loginError.message)
        }
        setLoading(false)
        return
      }

      // Success - redirect to dashboard
      if (data?.session) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</span>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="your@email.com"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</span>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign up
              </a>
            </p>
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              Having trouble? Make sure your email is confirmed and check your credentials.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
