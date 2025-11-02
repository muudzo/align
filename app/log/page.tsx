"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../(auth)/auth-provider'
import type { DailyLog } from '../../types'

export default function DailyLogPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [reflection, setReflection] = useState('')
  const [mood, setMood] = useState<number>(6)
  const [alcoholFree, setAlcoholFree] = useState(false)
  const [impulseControl, setImpulseControl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    let mounted = true

    async function loadToday() {
      if (!user) return

      setLoading(true)
      setError(null)
      
      try {
        const { data, error: fetchError } = await supabase
          .from('daily_logs')
          .select('*')
          .eq('date', today)
          .single()

        if (!mounted) return

        if (fetchError) {
          // No entry yet is fine, just means it's a new log
          if (fetchError.code === 'PGRST116') {
            setLoading(false)
            return
          }
          setError(fetchError.message)
          setLoading(false)
          return
        }

        if (data) {
          setReflection(data.reflection ?? '')
          setMood(typeof data.mood === 'number' && data.mood >= 1 && data.mood <= 10 ? data.mood : 6)
          setAlcoholFree(Boolean(data.alcohol_free))
          setImpulseControl(Boolean(data.impulse_control))
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load log entry'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadToday()
    }

    return () => { mounted = false }
  }, [today, user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    
    if (!user) {
      setError('You must be signed in to save your log.')
      return
    }

    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const row = {
        user_id: user.id,
        date: today,
        alcohol_free: alcoholFree,
        impulse_control: impulseControl,
        mood,
        reflection: reflection.trim() || null,
      }

      const { error: upsertError } = await supabase
        .from('daily_logs')
        .upsert(row, { onConflict: 'user_id,date' })

      if (upsertError) {
        setError(upsertError.message)
        setLoading(false)
        return
      }

      // Success — navigate back to dashboard
      setMessage('Log saved successfully!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save log entry'
      setError(errorMessage)
      setLoading(false)
    }
  }

  if (authLoading || (loading && !reflection && mood === 6)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Daily Log</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{today}</p>

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

        <form onSubmit={handleSave}>
          <label className="block mb-6">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reflection</span>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="How did today go? What did you learn?"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mood: <span className="font-bold text-lg">{mood}</span> / 10
            </span>
            <input
              type="range"
              min={1}
              max={10}
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1 - Poor</span>
              <span>10 - Excellent</span>
            </div>
          </label>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={alcoholFree}
                onChange={(e) => setAlcoholFree(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alcohol-Free ✅
              </span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={impulseControl}
                onChange={(e) => setImpulseControl(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Impulse Control ✅
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => router.push('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
