import React from 'react'

interface AverageMoodProps {
  value: number | null
}

export default function AverageMood({ value }: AverageMoodProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Average Mood</h4>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {value !== null ? value.toFixed(1) : '—'}
      </p>
      {value !== null && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">out of 10</p>
      )}
    </div>
  )
}
