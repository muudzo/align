-- Migration: create daily_logs table
-- Creates the daily_logs table with a unique constraint on (user_id, date)

-- Ensure pgcrypto (for gen_random_uuid) is available in Supabase
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  alcohol_free boolean DEFAULT false,
  impulse_control boolean DEFAULT false,
  mood integer CHECK (mood >= 1 AND mood <= 10),
  reflection text,
  created_at timestamptz DEFAULT now()
);

-- Prevent duplicates per user per date
CREATE UNIQUE INDEX IF NOT EXISTS daily_logs_user_date_idx ON public.daily_logs (user_id, date);
