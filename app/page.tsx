import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Align</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Track your daily discipline, mood, and personal growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Track Mood</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Record your daily mood on a scale of 1-10 and visualize trends over time.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Build Streaks</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maintain sobriety and impulse control streaks to build consistent habits.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Reflect Daily</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Write daily reflections to track your progress and learn from each day.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
