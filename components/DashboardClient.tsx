"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import StreakCard from './StreakCard'
import AverageMood from './AverageMood'
import MoodTrend from './MoodTrend'
import Quote from './Quote'
import { computeStats } from '../lib/calcStreaks'

export default function DashboardClient() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      const { data, error } = await supabase.from('daily_logs').select('date, alcohol_free, impulse_control, mood').order('date', { ascending: false })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      if (!mounted) return
      setRows(data ?? [])
      const computed = computeStats(data ?? [])
      setStats(computed)
      setLoading(false)
    }

    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  async function exportCSV() {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from('daily_logs').select('date, alcohol_free, impulse_control, mood, reflection').order('date', { ascending: true })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const rows = data ?? []
      if (rows.length === 0) {
        setError('No logs to export')
        setLoading(false)
        return
      }

      const headers = ['date','alcohol_free','impulse_control','mood','reflection']
      const csv = [headers.join(',')]
      for (const r of rows) {
        const line = headers.map(h => {
          const v = (r as any)[h]
          if (v === null || v === undefined) return ''
          const s = String(v).replace(/"/g, '""')
          return `"${s}"`
        }).join(',')
        csv.push(line)
      }

      const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'align-daily-logs.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <StreakCard title="Sobriety Streak" count={stats.sobrietyStreak} />
          <StreakCard title="Impulse Mastery Streak" count={stats.impulseStreak} />
          <AverageMood value={stats.avgMood} />
        </div>
        <div className="ml-4 flex items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-2 rounded border">Export CSV</button>
        </div>
      </div>

      <MoodTrend data={stats.recentMoods.length ? stats.recentMoods : [7,7,7,7,7,7]} />

      <div className="mt-6">
        <Quote />
      </div>
    </div>
  )
}
