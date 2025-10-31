"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(res => setSession((res as any).data?.session ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession((session as any)?.session ?? session ?? null)
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  return <>{children}</>
}
