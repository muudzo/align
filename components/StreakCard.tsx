import React from 'react'

export default function StreakCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="mt-2 text-2xl font-bold">{count}</p>
    </div>
  )
}
