"use client"
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/app/(auth)/auth-provider'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Renders a 14-day mood trend line chart for the current user
export default function MoodTrend() {
  const { user } = useAuth()
  const [data, setData] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function fetchMoodData() {
      if (!user) return // Type guard
      
      setLoading(true)
      setError(null)

      try {
        // Fetch last 14 days of daily_logs for the current user
        const { data: logs, error: fetchError } = await supabase
          .from('daily_logs')
          .select('date,mood')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(14)

        if (fetchError) throw fetchError

        // Map moods and fill missing days with null
        const today = new Date()
        const moodsArray: number[] = []

        type LogEntry = { date: string; mood: number | null }
        
        for (let i = 13; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          const formattedDate = date.toISOString().slice(0, 10)
          const log = logs?.find((l: LogEntry) => l.date === formattedDate)
          moodsArray.push(log?.mood ?? 0) // 0 means no entry yet
        }

        setData(moodsArray)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch mood data'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchMoodData()
  }, [user])

  const labels = data.map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (data.length - i - 1))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#e5e7eb' : '#374151'
  const gridColor = isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood (1-10)',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  }

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading mood trend...</div>
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400">{error}</div>
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Mood Trend (Last 14 Days)</h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
