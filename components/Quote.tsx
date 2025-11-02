"use client"
import React, { useEffect, useState } from 'react'

const QUOTES: string[] = [
  "Small daily improvements are the key to staggering long-term results.",
  "Discipline is choosing between what you want now and what you want most.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Focus on progress, not perfection.",
  "Today's choices shape tomorrow's outcomes.",
  "The only bad workout is the one that didn't happen.",
  "Consistency is the mother of mastery.",
  "Your future self is counting on you today.",
]

export default function Quote() {
  const [quote, setQuote] = useState<string>('')

  useEffect(() => {
    const idx = Math.floor(Math.random() * QUOTES.length)
    setQuote(QUOTES[idx])
  }, [])

  if (!quote) {
    return null
  }

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Daily Motivation</h3>
      <p className="text-lg text-gray-900 dark:text-gray-100 italic">&ldquo;{quote}&rdquo;</p>
    </div>
  )
}
