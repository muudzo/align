"use client"
import React, { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your inbox for confirmation (if enabled)')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignup} className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Sign up</h2>
        {message && <div className="text-sm mb-2">{message}</div>}
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input className="mt-1 block w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 block w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
    </div>
  )
}
