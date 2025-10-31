import React from 'react'
import Quote from '../../components/Quote'
import StreakCard from '../../components/StreakCard'
import AverageMood from '../../components/AverageMood'

export default function DashboardPage() {
  // placeholders until we wire real data
  const sobrietyStreak = 5
  const impulseStreak = 3
  const avgMood = 7.4

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StreakCard title="Sobriety Streak" count={sobrietyStreak} />
          <StreakCard title="Impulse Mastery Streak" count={impulseStreak} />
          <AverageMood value={avgMood} />
        </div>

        <div className="mt-6">
          <Quote />
        </div>
      </div>
    </main>
  )
}
