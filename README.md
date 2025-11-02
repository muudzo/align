 # Align — Personal Discipline Tracker

A production-ready Next.js application for tracking daily discipline, mood, and personal growth. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- ✅ **Daily Logging**: Track mood (1-10), reflections, sobriety, and impulse control
- 📊 **Dashboard**: View streaks, average mood, and mood trends with interactive charts
- 🔐 **Authentication**: Secure user authentication with Supabase Auth
- 🌓 **Dark Mode**: System-aware dark mode with persistent preference
- 📤 **Data Export**: Export your logs as CSV
- 🎨 **Responsive Design**: Beautiful UI that works on all devices
- 🔒 **Row-Level Security**: Database-level security policies

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project ([sign up here](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd align
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Open your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration from `db/migrations/001_create_daily_logs.sql`
   - Run the RLS policies from `db/migrations/002_rls_policies.sql`

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Migration 1: Create daily_logs table

Run `db/migrations/001_create_daily_logs.sql` in Supabase SQL Editor. This creates:
- `daily_logs` table with fields: `id`, `user_id`, `date`, `alcohol_free`, `impulse_control`, `mood`, `reflection`, `created_at`
- Unique index on `(user_id, date)` to prevent duplicate entries per user per day

### Migration 2: Enable Row-Level Security

Run `db/migrations/002_rls_policies.sql` in Supabase SQL Editor. This enables:
- RLS on the `daily_logs` table
- Policies ensuring users can only access their own data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) | Optional |

Find these in your Supabase project settings under "API".

## Project Structure

```
align/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── dashboard/         # Dashboard page
│   ├── log/               # Daily log entry page
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── DashboardClient.tsx
│   ├── Header.tsx
│   ├── MoodTrend.tsx
│   └── ...
├── db/
│   └── migrations/        # SQL migration files
├── lib/                   # Utility libraries
│   ├── supabaseClient.ts
│   └── calcStreaks.ts
├── types/                 # TypeScript type definitions
└── tests/                 # Test files
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Chart.js + react-chartjs-2

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Ensure environment variables are set in your hosting platform.

### Security Checklist

- ✅ RLS policies enabled in Supabase
- ✅ Environment variables not exposed to client (except `NEXT_PUBLIC_*`)
- ✅ Authentication guards on protected routes
- ✅ Input validation on forms
- ✅ Error handling throughout the application

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
