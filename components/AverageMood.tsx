import React from 'react'

export default function AverageMood({ value }: { value: number | null }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h4 className="text-sm text-gray-500">Average Mood</h4>
      <p className="mt-2 text-2xl font-bold">{value !== null ? value.toFixed(1) : '—'}</p>
    </div>
  )
}
