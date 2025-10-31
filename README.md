 # Align — Personal Discipline Tracker

Lightweight Next.js app scaffold for tracking daily discipline, mood and focus. Built with Next.js, Tailwind CSS and Supabase.

Getting started

1. Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL and anon key.
2. Install dependencies:

```bash
npm install
```

3. Run the dev server:

```bash
npm run dev
```

Database

- The repository contains a SQL migration at `db/migrations/001_create_daily_logs.sql` to create the `daily_logs` table with a unique index on `(user_id, date)`.
- Create RLS policies in Supabase so users can only read/write their own rows (example in repo notes).

Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (only for server migrations/administrative tasks)

Development notes

- Dark mode uses the `dark` class strategy and persists selection in localStorage.
- Dashboard fetches `daily_logs` via Supabase client and computes streaks client-side.

Next steps

- Improve server-side session handling (use `@supabase/ssr` properly) for protected pages.
- Add RLS policies and database seed/migration automation.
