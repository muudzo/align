-- Row Level Security (RLS) Policies for daily_logs table
-- These policies ensure users can only read/write their own daily log entries

-- Enable RLS on the daily_logs table
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own daily logs
CREATE POLICY "Users can view their own daily logs"
ON public.daily_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own daily logs
CREATE POLICY "Users can insert their own daily logs"
ON public.daily_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own daily logs
CREATE POLICY "Users can update their own daily logs"
ON public.daily_logs
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own daily logs
CREATE POLICY "Users can delete their own daily logs"
ON public.daily_logs
FOR DELETE
USING (auth.uid() = user_id);

