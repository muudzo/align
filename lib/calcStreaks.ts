import { LogStats } from '../types'

export type LogRow = {
  date: string // YYYY-MM-DD
  alcohol_free: boolean | null
  impulse_control: boolean | null
  mood: number | null
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function computeStats(rows: LogRow[]): LogStats {
  // rows expected in descending date order (newest first)
  if (!rows || rows.length === 0) {
    return {
      sobrietyStreak: 0,
      impulseStreak: 0,
      avgMood: null,
      recentMoods: [],
    }
  }

  // average mood
  const moodValues = rows.map(r => r.mood).filter((m): m is number => typeof m === 'number')
  const avgMood = moodValues.length ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length : null

  // recent moods (chronological oldest -> newest) take last 14 entries
  const recent = rows
    .slice(0, 30)
    .map(r => r.mood)
    .filter((m): m is number => typeof m === 'number')
  const recentMoods = recent.slice(-14).reverse()

  // compute streaks: start from the most recent date present
  const dateMap = new Map<string, LogRow>()
  for (const r of rows) dateMap.set(r.date, r)

  const mostRecentDate = rows[0].date
  let current = new Date(mostRecentDate)

  function countStreak(checkKey: keyof LogRow): number {
    let streak = 0
    let cursor = new Date(current)
    while (true) {
      const key = formatDate(cursor)
      const row = dateMap.get(key)
      if (!row) break
      const val = row[checkKey]
      if (val === true) streak++
      else break
      cursor.setDate(cursor.getDate() - 1)
    }
    return streak
  }

  const sobrietyStreak = countStreak('alcohol_free')
  const impulseStreak = countStreak('impulse_control')

  return { sobrietyStreak, impulseStreak, avgMood, recentMoods }
}
