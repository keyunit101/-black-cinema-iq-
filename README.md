# Black Cinema IQ 🎬

An addictive, timed quiz game about iconic Black films from the golden era of Black cinema (1988–2002).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Web Audio API** — all sounds generated in code, zero audio files
- No external UI libraries — 100% custom

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1 — Vercel CLI

```bash
npx vercel --prod
```

### Option 2 — GitHub → Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy** — done

## Leaderboard Note

The leaderboard uses **in-memory storage** and resets on every redeploy.

### Upgrade to Supabase (persistence)

1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL:

```sql
create table leaderboard (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  score integer not null default 0,
  streak integer not null default 0,
  correct integer not null default 0,
  total integer not null default 0,
  submitted_at timestamptz default now()
);
create index on leaderboard (score desc);
```

3. `npm install @supabase/supabase-js`
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   SUPABASE_SERVICE_ROLE_KEY=your-key
   ```
5. Update `src/app/api/leaderboard/route.ts` to use Supabase upsert.

## Films Covered

| Film | Year |
|------|------|
| Boyz N the Hood | 1991 |
| Set It Off | 1996 |
| Friday | 1995 |
| Coming to America | 1988 |
| New Jack City | 1991 |
| Waiting to Exhale | 1995 |
| Love Jones | 1997 |
| The Players Club | 1998 |
| Belly | 1998 |
| Brown Sugar | 2002 |
| B.A.P.S. | 1997 |
| How to Be a Player | 1997 |
