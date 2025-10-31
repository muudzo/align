"use client"
import React, { useEffect, useState } from 'react'

const QUOTES = [
  "Small daily improvements are the key to staggering long-term results.",
  "Discipline is choosing between what you want now and what you want most.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Focus on progress, not perfection.",
  "Today’s choices shape tomorrow’s outcomes."
]

export default function Quote() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    const idx = Math.floor(Math.random() * QUOTES.length)
    setQuote(QUOTES[idx])
  }, [])

  return (
    <div className="p-4 rounded bg-white dark:bg-gray-800 shadow">
      <h3 className="text-sm text-gray-500 dark:text-gray-400">Motivational Quote</h3>
      <p className="mt-2 text-lg">“{quote}”</p>
    </div>
  )
}
