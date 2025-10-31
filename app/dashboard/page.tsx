import React from 'react'
import { createSupabaseServerClient } from '../../lib/supabaseServerClient'

export default async function DashboardPage() {
  // For now we create a server client and attempt to read from auth to get user
  let user = null
  try {
    const supabase = createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    user = (data as any).user ?? null
  } catch (err) {
    // ignore
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="mt-3">You are not signed in. Please <a className="text-blue-600" href="/login">login</a>.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Welcome back, {(user as any).email}</h1>
      <p className="mt-2">This is the placeholder dashboard; mood charts and streaks will go here.</p>
    </main>
  )
}
