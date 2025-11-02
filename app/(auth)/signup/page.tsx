"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '../auth-provider'

export default function SignupPage() {
  const router = useRouter()
  const { session, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && session) {
      router.push('/dashboard')
    }
  }, [session, authLoading, router])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    // Normalize email - trim whitespace and convert to lowercase
    const normalizedEmail = email.trim().toLowerCase()

    // Basic validation
    if (!normalizedEmail || !password.trim()) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email: normalizedEmail, 
        password 
      })

      if (signUpError) {
        // Provide user-friendly error messages
        if (signUpError.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // Email confirmation required
        setMessage('Account created! Please check your email to confirm your account before signing in.')
        setTimeout(() => {
          router.push('/login')
        }, 4000)
      } else if (data?.session) {
        // No email confirmation required - auto login
        setMessage('Account created successfully! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      } else {
        // Fallback
        setMessage('Account created! You can now sign in.')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
      
      setLoading(false)
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
        <form onSubmit={handleSignup} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Sign up</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-600 dark:text-green-400 text-sm">
              {message}
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
              minLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="At least 6 characters"
            />
            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">Must be at least 6 characters</span>
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
