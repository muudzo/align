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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StreakCard title="Sobriety Streak" count={stats.sobrietyStreak} />
        <StreakCard title="Impulse Mastery Streak" count={stats.impulseStreak} />
        <AverageMood value={stats.avgMood} />
      </div>

      <MoodTrend data={stats.recentMoods.length ? stats.recentMoods : [7,7,7,7,7,7]} />

      <div className="mt-6">
        <Quote />
      </div>
    </div>
  )
}
