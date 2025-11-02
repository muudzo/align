// Database types
export interface DailyLog {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  alcohol_free: boolean
  impulse_control: boolean
  mood: number | null // 1-10
  reflection: string | null
  created_at: string
}

// Stats types
export interface LogStats {
  sobrietyStreak: number
  impulseStreak: number
  avgMood: number | null
  recentMoods: number[]
}

// Form types
export interface DailyLogForm {
  reflection: string
  mood: number
  alcoholFree: boolean
  impulseControl: boolean
}

// Auth types
export interface AuthUser {
  id: string
  email?: string
}

