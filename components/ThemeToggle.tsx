"use client"
import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'align:dark'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const pref = stored ? stored === 'true' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(pref)
    updateClass(pref)
  }, [])

  function updateClass(dark: boolean) {
    const el = document.documentElement
    if (dark) el.classList.add('dark')
    else el.classList.remove('dark')
  }

  function toggle() {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem(STORAGE_KEY, String(next))
    updateClass(next)
  }

  if (isDark === null) return null

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="px-3 py-1 rounded border">
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
