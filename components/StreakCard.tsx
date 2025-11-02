import React from 'react'

interface StreakCardProps {
  title: string
  count: number
}

export default function StreakCard({ title, count }: StreakCardProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        {count === 1 ? 'day' : 'days'}
      </p>
    </div>
  )
}
