"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DailyLogPage() {
  const router = useRouter()
  const [reflection, setReflection] = useState('')
  const [mood, setMood] = useState<number>(6)
  const [alcoholFree, setAlcoholFree] = useState(false)
  const [impulseControl, setImpulseControl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    let mounted = true
    async function loadToday() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('daily_logs').select('*').eq('date', today).single()
        if (!mounted) return
        if (error) {
          // no entry yet or other error
          setLoading(false)
          return
        }
        if (data) {
          setReflection(data.reflection ?? '')
          setMood(typeof data.mood === 'number' ? data.mood : 6)
          setAlcoholFree(Boolean(data.alcohol_free))
          setImpulseControl(Boolean(data.impulse_control))
        }
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadToday()
    return () => { mounted = false }
  }, [today])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const userRes = await supabase.auth.getUser()
      const user = (userRes as any).data?.user
      if (!user) {
        setMessage('You must be signed in to save your log.')
        setLoading(false)
        return
      }

      const row = {
        user_id: user.id,
        date: today,
        alcohol_free: alcoholFree,
        impulse_control: impulseControl,
        mood,
        reflection,
      }

      const { error } = await supabase.from('daily_logs').upsert(row, { onConflict: 'user_id,date' })
      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      // Success — navigate back to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setMessage(err?.message ?? String(err))
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Daily Log — {today}</h1>
        {message && <div className="text-sm text-red-600 mb-3">{message}</div>}

        <form onSubmit={handleSave}>
          <label className="block mb-4">
            <span className="text-sm">Reflection</span>
            <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} rows={6} className="mt-1 block w-full p-2 rounded bg-gray-50 dark:bg-gray-900" />
          </label>

          <label className="block mb-4">
            <span className="text-sm">Mood: {mood}</span>
            <input type="range" min={1} max={10} value={mood} onChange={(e) => setMood(Number(e.target.value))} className="mt-2 w-full" />
          </label>

          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={alcoholFree} onChange={(e) => setAlcoholFree(e.target.checked)} />
              <span className="text-sm">Alcohol-Free ✅</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={impulseControl} onChange={(e) => setImpulseControl(e.target.checked)} />
              <span className="text-sm">Impulse Control ✅</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save Entry'}</button>
            <button type="button" className="px-4 py-2 rounded border" onClick={() => router.push('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  )
}
