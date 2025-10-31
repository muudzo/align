"use client"
import React from 'react'
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
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function MoodTrend({ data }: { data: number[] }) {
  const labels = data.map((_, i) => `Day ${i + 1}`)
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood (1-10)',
        data,
        borderColor: 'rgb(59,130,246)',
        backgroundColor: 'rgba(59,130,246,0.2)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { y: { min: 1, max: 10 } },
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow mt-6">
      <h3 className="text-sm text-gray-500">Mood Trend</h3>
      <div className="mt-3">
        <Line data={chartData} options={options as any} />
      </div>
    </div>
  )
}
