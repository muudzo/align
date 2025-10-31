"use client"
import React from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <a href="/" className="font-bold">Align</a>
          <a href="/dashboard" className="text-sm text-gray-600 dark:text-gray-300">Dashboard</a>
          <a href="/log" className="text-sm text-gray-600 dark:text-gray-300">Daily Log</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
