import { describe, it, expect } from 'vitest'
import { computeStats } from '../lib/calcStreaks'

describe('computeStats', () => {
  it('returns zeros/nulls for empty input', () => {
    const res = computeStats([])
    expect(res.sobrietyStreak).toBe(0)
    expect(res.impulseStreak).toBe(0)
    expect(res.avgMood).toBeNull()
    expect(Array.isArray(res.recentMoods)).toBe(true)
  })

  it('computes average mood and recent moods', () => {
    const rows = [
      { date: '2025-11-03', alcohol_free: true, impulse_control: true, mood: 8 },
      { date: '2025-11-02', alcohol_free: true, impulse_control: false, mood: 7 },
      { date: '2025-11-01', alcohol_free: false, impulse_control: true, mood: 6 },
    ]

    const res = computeStats(rows)
    expect(res.avgMood).toBeCloseTo((8 + 7 + 6) / 3)
    expect(res.recentMoods.length).toBeGreaterThan(0)
  })

  it('calculates consecutive true streaks from most recent date', () => {
    const rows = [
      { date: '2025-11-03', alcohol_free: true, impulse_control: true, mood: 8 },
      { date: '2025-11-02', alcohol_free: true, impulse_control: true, mood: 7 },
      { date: '2025-11-01', alcohol_free: false, impulse_control: true, mood: 6 },
    ]

    const res = computeStats(rows)
    // Alcohol-free: last two days true => streak 2
    expect(res.sobrietyStreak).toBe(2)
    // Impulse control: last three days true except 2025-11-01 is true as well => streak 3
    expect(res.impulseStreak).toBe(3)
  })
})
