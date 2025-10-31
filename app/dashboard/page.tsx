import React from 'react'
import dynamic from 'next/dynamic'

const DashboardClient = dynamic(() => import('../../components/DashboardClient'), { ssr: false })

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <DashboardClient />
    </main>
  )
}
