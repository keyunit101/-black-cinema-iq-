import { NextRequest, NextResponse } from 'next/server';

interface LeaderboardEntry {
  name: string;
  score: number;
  streak: number;
  correct: number;
  total: number;
  submittedAt: number;
}

// In-memory store — resets on redeploy. Upgrade to Supabase/PlanetScale for persistence.
const leaderboard: LeaderboardEntry[] = [];
const MAX_ENTRIES = 20;

export async function GET() {
  const sorted = [...leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
  return NextResponse.json(sorted);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, score, streak, correct, total } = body;

    if (
      typeof name !== 'string' ||
      name.trim().length < 1 ||
      name.trim().length > 24 ||
      typeof score !== 'number' ||
      typeof streak !== 'number' ||
      typeof correct !== 'number' ||
      typeof total !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const cleanName = name.trim().slice(0, 24);

    // Upsert: keep highest score per name
    const existing = leaderboard.findIndex(
      (e) => e.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existing >= 0) {
      if (score > leaderboard[existing].score) {
        leaderboard[existing] = { name: cleanName, score, streak, correct, total, submittedAt: Date.now() };
      }
    } else {
      leaderboard.push({ name: cleanName, score, streak, correct, total, submittedAt: Date.now() });
    }

    // Sort and trim
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > MAX_ENTRIES) {
      leaderboard.splice(MAX_ENTRIES);
    }

    const rank = leaderboard.findIndex(
      (e) => e.name.toLowerCase() === cleanName.toLowerCase()
    ) + 1;

    return NextResponse.json({ success: true, rank });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
