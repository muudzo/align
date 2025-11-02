"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../app/(auth)/auth-provider'
import StreakCard from './StreakCard'
import AverageMood from './AverageMood'
import MoodTrend from './MoodTrend'
import Quote from './Quote'
import { computeStats } from '../lib/calcStreaks'
import type { LogStats } from '../types'

export default function DashboardClient() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Array<{ date: string; alcohol_free: boolean | null; impulse_control: boolean | null; mood: number | null }>>([])
  const [stats, setStats] = useState<LogStats | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('daily_logs')
          .select('date, alcohol_free, impulse_control, mood')
          .order('date', { ascending: false })

        if (fetchError) {
          setError(fetchError.message)
          setLoading(false)
          return
        }

        if (!mounted) return

        setRows(data ?? [])
        const computed = computeStats(data ?? [])
        setStats(computed)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      load()
    }

    return () => { mounted = false }
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    )
  }

  async function exportCSV() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('daily_logs')
        .select('date, alcohol_free, impulse_control, mood, reflection')
        .order('date', { ascending: true })

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      const exportRows = data ?? []
      if (exportRows.length === 0) {
        setError('No logs to export')
        setLoading(false)
        return
      }

      const headers = ['date', 'alcohol_free', 'impulse_control', 'mood', 'reflection']
      const csv = [headers.join(',')]
      
      for (const row of exportRows) {
        const line = headers.map((h) => {
          const v = row[h as keyof typeof row]
          if (v === null || v === undefined) return ''
          const s = String(v).replace(/"/g, '""')
          return `"${s}"`
        }).join(',')
        csv.push(line)
      }

      const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `align-daily-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const defaultMoods = [7, 7, 7, 7, 7, 7]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your daily discipline and progress</p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
          <StreakCard title="Sobriety Streak" count={stats?.sobrietyStreak ?? 0} />
          <StreakCard title="Impulse Mastery Streak" count={stats?.impulseStreak ?? 0} />
          <AverageMood value={stats?.avgMood ?? null} />
        </div>
        <button
          onClick={exportCSV}
          disabled={loading || !stats || rows.length === 0}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <MoodTrend data={stats?.recentMoods && stats.recentMoods.length > 0 ? stats.recentMoods : defaultMoods} />

      <div className="mt-6">
        <Quote />
      </div>
    </div>
  )
}
