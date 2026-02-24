'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_QUESTIONS, MOVIES, TIMER_SECS, CIRCUMFERENCE, type Question } from '@/lib/questions';
import { useSounds } from '@/hooks/useSounds';

// ── Types ──────────────────────────────────────────────────────────────────────

interface TimerState {
  remaining: number;
  total: number;
  running: boolean;
  done: boolean;
  paused: boolean;
}

interface CardState {
  question: Question;
  chosen: number | null;
  timedOut: boolean;
  timer: TimerState;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  streak: number;
  correct: number;
  total: number;
}

interface FlashOverlay {
  type: 'correct' | 'wrong' | 'timeout';
  key: number;
}

interface PopMessage {
  text: string;
  key: number;
  emoji: string;
}

const CONF_COLORS = ['#FFB800', '#FF2D55', '#00E676', '#9C27B0', '#2196F3'];
const BATCH_SIZE = 3;

// ── Helpers ────────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getStreakColor(streak: number): string {
  if (streak >= 5) return '#FF2D55';
  if (streak >= 3) return '#FFB800';
  return '#00E676';
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.4,
  }));
}

// ── Timer Arc Component ────────────────────────────────────────────────────────

function TimerArc({
  timer,
  filmColor,
  cardIndex,
}: {
  timer: TimerState;
  filmColor: string;
  cardIndex: number;
}) {
  const pct = timer.remaining / timer.total;
  const isUrgent = pct <= 0.5;
  const isDanger = pct <= 0.25;
  const isPaused = timer.paused && !timer.done;

  const arcColor = isDanger ? '#FF2D55' : isUrgent ? '#FF6B00' : filmColor;
  const offset = CIRCUMFERENCE * (1 - pct);
  const bonus = Math.round(timer.remaining * 3);

  return (
    <div className="flex flex-col items-center gap-2 py-3">
      {/* Paused label */}
      {isPaused && (
        <div
          className="text-xs font-mono animate-film-pulse mb-1"
          style={{ color: '#555', letterSpacing: '0.05em' }}
        >
          ⏸ SCROLL INTO VIEW TO START
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* SVG Arc */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Track */}
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="#222"
              strokeWidth="3"
            />
            {/* Arc */}
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke={arcColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{
                opacity: isPaused ? 0.25 : 1,
                transition: 'stroke-dashoffset 0.5s linear, stroke 0.3s',
              }}
            />
          </svg>
          {/* Countdown number */}
          <span
            className={`absolute font-mono font-bold text-sm ${
              isDanger ? 'animate-urgent-fast' : isUrgent ? 'animate-urgent-slow' : ''
            }`}
            style={{
              color: isPaused ? '#555' : arcColor,
              transform: 'rotate(0deg)',
            }}
          >
            {Math.ceil(timer.remaining)}
          </span>
        </div>

        {/* Bar + bonus */}
        <div className="flex-1 flex flex-col gap-1">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: '#222', width: '140px' }}
          >
            <div
              style={{
                width: `${pct * 100}%`,
                background: arcColor,
                height: '100%',
                transition: 'width 0.5s linear, background 0.3s',
                opacity: isPaused ? 0.25 : 1,
                boxShadow: isPaused ? 'none' : `0 0 6px ${arcColor}88`,
              }}
            />
          </div>
          <div className="font-mono text-xs" style={{ color: '#888' }}>
            ⚡ +{bonus}pts preview
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Question Card Component ────────────────────────────────────────────────────

function QuizCard({
  cardState,
  cardIndex,
  onAnswer,
  animDelay,
}: {
  cardState: CardState;
  cardIndex: number;
  onAnswer: (cardIndex: number, optionIndex: number) => void;
  animDelay: number;
}) {
  const { question, chosen, timedOut, timer } = cardState;
  const movie = MOVIES[question.cat] || null;
  const filmColor = movie?.color ?? '#FFB800';
  const isAnswered = chosen !== null || timedOut;
  const isFocused = timer.running && !timer.done;

  return (
    <div
      className="rounded-2xl overflow-hidden animate-card-in"
      style={{
        background: '#161616',
        border: isFocused
          ? `1px solid ${filmColor}66`
          : '1px solid #222',
        boxShadow: isFocused
          ? `0 0 20px ${filmColor}22, 0 4px 24px rgba(0,0,0,0.6)`
          : '0 4px 24px rgba(0,0,0,0.4)',
        animationDelay: `${animDelay}ms`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      id={`card-${cardIndex}`}
    >
      {/* Movie Banner */}
      {movie && (
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${filmColor}22, ${filmColor}08)`,
            borderBottom: `1px solid ${filmColor}33`,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: filmColor, boxShadow: `0 0 6px ${filmColor}` }}
            />
            <span className="font-display text-sm tracking-widest" style={{ color: filmColor }}>
              {movie.title.toUpperCase()}
            </span>
            <span className="font-mono text-xs" style={{ color: '#555' }}>
              {movie.year}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{ background: '#222', color: '#888' }}
            >
              {question.type}
            </span>
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                background: filmColor + '22',
                color: filmColor,
                border: `1px solid ${filmColor}44`,
              }}
            >
              {'★'.repeat(question.diff)}{'☆'.repeat(5 - question.diff)}
            </span>
          </div>
        </div>
      )}

      {/* Timer */}
      {!isAnswered && (
        <div className="px-4" style={{ borderBottom: '1px solid #222' }}>
          <TimerArc timer={timer} filmColor={filmColor} cardIndex={cardIndex} />
        </div>
      )}

      {/* Timeout banner */}
      {timedOut && (
        <div
          className="px-4 py-3 text-center font-mono text-sm animate-slide-in"
          style={{
            background: '#1a0a0a',
            borderBottom: '1px solid #FF2D5533',
            color: '#FF2D55',
          }}
        >
          ⏱ TIME&apos;S UP — No points awarded
        </div>
      )}

      {/* Question */}
      <div className="px-4 pt-4 pb-3">
        <p
          className="font-body text-base leading-relaxed"
          style={{ color: '#F0EDE8', fontWeight: 500 }}
        >
          {question.q}
        </p>
      </div>

      {/* Options */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {question.opts.map((opt, i) => {
          const isCorrect = i === question.ans;
          const isChosen = chosen === i;
          let borderColor = '#333';
          let bg = '#1c1c1c';
          let textColor = '#F0EDE8';
          let extraClass = '';

          if (isAnswered) {
            if (isChosen && isCorrect) {
              borderColor = '#00E676';
              bg = '#00E67611';
              textColor = '#00E676';
            } else if (isChosen && !isCorrect) {
              borderColor = '#FF2D55';
              bg = '#FF2D5511';
              textColor = '#FF2D5588';
              extraClass = 'line-through';
            } else if (isCorrect) {
              borderColor = '#00E67644';
              bg = '#00E67608';
              textColor = '#00E67688';
            }
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && onAnswer(cardIndex, i)}
              disabled={isAnswered}
              className="w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-all duration-200"
              style={{
                background: bg,
                border: `1px solid ${borderColor}`,
                color: textColor,
                cursor: isAnswered ? 'default' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isAnswered) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = filmColor + '88';
                  (e.currentTarget as HTMLButtonElement).style.background = filmColor + '11';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnswered) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#333';
                  (e.currentTarget as HTMLButtonElement).style.background = '#1c1c1c';
                }
              }}
            >
              <span className="font-mono text-xs mr-3" style={{ color: '#555' }}>
                {String.fromCharCode(65 + i)}.
              </span>
              <span className={extraClass}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div
          className="mx-4 mb-4 px-4 py-3 rounded-xl animate-slide-in"
          style={{
            background: '#111',
            borderLeft: `3px solid ${filmColor}`,
          }}
        >
          <p className="font-body text-sm leading-relaxed" style={{ color: '#aaa' }}>
            {question.explain}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Leaderboard Modal ──────────────────────────────────────────────────────────

function LeaderboardModal({
  score,
  streak,
  correct,
  total,
  onClose,
}: {
  score: number;
  streak: number;
  correct: number;
  total: number;
  onClose: () => void;
}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), score, streak, correct, total }),
      });
      const data = await res.json();
      setRank(data.rank);
      setSubmitted(true);
      const updated = await fetch('/api/leaderboard').then((r) => r.json());
      setEntries(updated);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: '#111', border: '1px solid #FFB80044', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #222' }}>
          <h2 className="font-display text-3xl text-gold-gradient">🏆 LEADERBOARD</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm transition-colors"
            style={{ background: '#222', color: '#888' }}
          >
            ✕
          </button>
        </div>

        {/* Your Score Card */}
        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ background: '#161616', border: '1px solid #FFB80033' }}>
          <div className="font-display text-sm tracking-widest mb-2" style={{ color: '#555' }}>YOUR SCORE</div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-display text-3xl text-gold-gradient">{score}</div>
              <div className="font-mono text-xs" style={{ color: '#555' }}>points</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl" style={{ color: '#00E676' }}>{streak}</div>
              <div className="font-mono text-xs" style={{ color: '#555' }}>best streak</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl" style={{ color: '#F0EDE8' }}>
                {correct}/{total}
              </div>
              <div className="font-mono text-xs" style={{ color: '#555' }}>correct</div>
            </div>
          </div>
        </div>

        {/* Name input or saved confirmation */}
        <div className="px-4 mt-4">
          {!submitted ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 24))}
                placeholder="Your name (max 24 chars)"
                className="flex-1 px-3 py-2 rounded-xl font-body text-sm outline-none"
                style={{
                  background: '#1c1c1c',
                  border: '1px solid #333',
                  color: '#F0EDE8',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <button
                onClick={handleSave}
                disabled={!name.trim() || saving}
                className="px-4 py-2 rounded-xl font-display text-sm tracking-wider transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #FFB800, #FF6B00)',
                  color: '#000',
                  opacity: !name.trim() || saving ? 0.5 : 1,
                }}
              >
                SAVE
              </button>
            </div>
          ) : (
            <div
              className="px-4 py-3 rounded-xl text-center font-body text-sm animate-slide-in"
              style={{ background: '#00E67611', border: '1px solid #00E67633', color: '#00E676' }}
            >
              ✓ Saved! You&apos;re ranked #{rank}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="px-4 mt-4 pb-4">
          <div className="font-display text-xs tracking-widest mb-2 px-2" style={{ color: '#555' }}>
            TOP {Math.min(entries.length, 20)}
          </div>
          {loading ? (
            <div className="text-center py-8 font-mono text-sm" style={{ color: '#555' }}>Loading…</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 font-mono text-sm" style={{ color: '#555' }}>
              No entries yet — be the first!
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #222' }}>
              {entries.map((entry, i) => {
                const isUser = submitted && entry.name.toLowerCase() === name.trim().toLowerCase();
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5"
                    style={{
                      background: isUser
                        ? '#FFB80011'
                        : i % 2 === 0 ? '#161616' : '#131313',
                      borderBottom: i < entries.length - 1 ? '1px solid #1a1a1a' : 'none',
                      border: isUser ? '1px solid #FFB80044' : undefined,
                    }}
                  >
                    <div
                      className="w-6 text-center font-mono text-sm"
                      style={{ color: isUser ? '#FFB800' : '#555' }}
                    >
                      {i < 3 ? medals[i] : `${i + 1}`}
                    </div>
                    <div className="flex-1 font-body text-sm" style={{ color: isUser ? '#FFB800' : '#F0EDE8' }}>
                      {entry.name}
                    </div>
                    <div className="font-mono text-sm font-bold" style={{ color: isUser ? '#FFB800' : '#F0EDE8' }}>
                      {entry.score}
                    </div>
                    <div className="font-mono text-xs" style={{ color: '#555' }}>
                      {entry.correct}/{entry.total}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main QuizFeed Component ────────────────────────────────────────────────────

export default function QuizFeed() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [cards, setCards] = useState<CardState[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [flash, setFlash] = useState<FlashOverlay | null>(null);
  const [popMsg, setPopMsg] = useState<PopMessage | null>(null);
  const [comboMsg, setComboMsg] = useState<string | null>(null);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { play } = useSounds();
  const timerRefs = useRef<Record<number, ReturnType<typeof setInterval>>>({});
  const observerRefs = useRef<Record<number, IntersectionObserver>>({});
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const streakRef = useRef(0);
  const scoreRef = useRef(0);
  const flashKeyRef = useRef(0);
  const popKeyRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { streakRef.current = streak; }, [streak]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  // ── Pool Management ──────────────────────────────────────────────

  const buildPool = useCallback((filter: string, excluded: Set<number>): Question[] => {
    const base = filter === 'all'
      ? ALL_QUESTIONS
      : ALL_QUESTIONS.filter((q) => q.cat === filter || q.cat === 'all');
    const available = base.filter((q) => !excluded.has(q.id));
    return shuffle(available);
  }, []);

  // ── Timer Logic ──────────────────────────────────────────────────

  const stopTimer = useCallback((cardIdx: number) => {
    if (timerRefs.current[cardIdx]) {
      clearInterval(timerRefs.current[cardIdx]);
      delete timerRefs.current[cardIdx];
    }
  }, []);

  const handleTimeout = useCallback((cardIdx: number) => {
    stopTimer(cardIdx);
    play('timeout');
    flashKeyRef.current++;
    setFlash({ type: 'timeout', key: flashKeyRef.current });
    setTimeout(() => setFlash(null), 400);

    popKeyRef.current++;
    setPopMsg({ text: '⏱', key: popKeyRef.current, emoji: '⏱' });
    setTimeout(() => setPopMsg(null), 800);

    setCards((prev) => {
      const next = [...prev];
      if (next[cardIdx]) {
        next[cardIdx] = {
          ...next[cardIdx],
          timedOut: true,
          timer: { ...next[cardIdx].timer, running: false, done: true, remaining: 0 },
        };
      }
      return next;
    });
    setStreak(0);
    streakRef.current = 0;
    setTotalAnswered((t) => t + 1);
  }, [stopTimer, play]);

  const startTimer = useCallback((cardIdx: number) => {
    // Guard: if an interval already exists for this card, don't create another
    if (timerRefs.current[cardIdx]) return;

    // Don't restart if already done or answered
    setCards((prev) => {
      const card = prev[cardIdx];
      if (!card || card.timer.done || card.chosen !== null || card.timedOut) return prev;
      if (card.timer.running) return prev; // already running

      const next = [...prev];
      next[cardIdx] = {
        ...next[cardIdx],
        timer: { ...next[cardIdx].timer, running: true, paused: false },
      };
      return next;
    });

    // Use a closure ref so the interval sees fresh remaining
    const intervalId = setInterval(() => {
      setCards((prev) => {
        const card = prev[cardIdx];
        if (!card || card.timer.done || card.chosen !== null || card.timedOut) {
          clearInterval(timerRefs.current[cardIdx]);
          delete timerRefs.current[cardIdx];
          return prev;
        }
        if (!card.timer.running) return prev;

        const newRemaining = card.timer.remaining - 0.5;

        // Tick sound on last 5 seconds
        if (Math.ceil(newRemaining) <= 5 && Math.ceil(newRemaining) !== Math.ceil(card.timer.remaining)) {
          play('tick');
        }

        if (newRemaining <= 0) {
          clearInterval(timerRefs.current[cardIdx]);
          delete timerRefs.current[cardIdx];
          // Schedule timeout handling outside setState
          setTimeout(() => handleTimeout(cardIdx), 0);
          return prev;
        }

        const next = [...prev];
        next[cardIdx] = {
          ...next[cardIdx],
          timer: { ...next[cardIdx].timer, remaining: newRemaining },
        };
        return next;
      });
    }, 500);

    timerRefs.current[cardIdx] = intervalId;
  }, [play, handleTimeout]);

  const pauseTimer = useCallback((cardIdx: number) => {
    stopTimer(cardIdx);
    setCards((prev) => {
      const card = prev[cardIdx];
      if (!card || card.timer.done) return prev;
      const next = [...prev];
      next[cardIdx] = {
        ...next[cardIdx],
        timer: { ...next[cardIdx].timer, running: false, paused: true },
      };
      return next;
    });
  }, [stopTimer]);

  // ── IntersectionObserver ─────────────────────────────────────────

  const observeCard = useCallback((cardIdx: number, el: HTMLDivElement | null) => {
    if (!el) return;
    if (observerRefs.current[cardIdx]) {
      observerRefs.current[cardIdx].disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCards((prev) => {
          const card = prev[cardIdx];
          if (!card || card.timer.done || card.chosen !== null || card.timedOut) return prev;
          if (entry.isIntersecting) {
            // Start/resume timer
            startTimer(cardIdx);
          } else {
            // Pause timer
            pauseTimer(cardIdx);
          }
          return prev;
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    observerRefs.current[cardIdx] = observer;
  }, [startTimer, pauseTimer]);

  // ── Card Reference Callbacks ─────────────────────────────────────

  const setCardRef = useCallback((cardIdx: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[cardIdx] = el;
    if (el) {
      observeCard(cardIdx, el);
    }
  }, [observeCard]);

  // ── Load Cards ───────────────────────────────────────────────────

  const loadCards = useCallback((
    filter: string,
    currentUsed: Set<number>,
    currentPool: Question[]
  ) => {
    let pool = currentPool;
    if (pool.length < BATCH_SIZE) {
      const newPool = buildPool(filter, currentUsed);
      pool = newPool;
      // If still empty after rebuild, we're truly out
      if (pool.length === 0) {
        setHasMore(false);
        return { newCards: [], newPool: [], newUsed: currentUsed };
      }
    }

    const batch = pool.slice(0, BATCH_SIZE);
    const remaining = pool.slice(BATCH_SIZE);
    const newUsed = new Set(currentUsed);
    batch.forEach((q) => newUsed.add(q.id));

    const totalSecs = TIMER_SECS[batch[0]?.diff ?? 1] ?? 15;
    const newCards: CardState[] = batch.map((q) => ({
      question: q,
      chosen: null,
      timedOut: false,
      timer: {
        remaining: TIMER_SECS[q.diff] ?? 15,
        total: TIMER_SECS[q.diff] ?? 15,
        running: false,
        done: false,
        paused: true,
      },
    }));

    return { newCards, newPool: remaining, newUsed };
  }, [buildPool]);

  // ── Initialize ───────────────────────────────────────────────────

  useEffect(() => {
    const initialPool = buildPool('all', new Set());
    const { newCards, newPool, newUsed } = loadCards('all', new Set(), initialPool);
    setCards(newCards);
    setQuestionPool(newPool);
    setUsedIds(newUsed);
    setHasMore(true);
    play('start');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filter Change ────────────────────────────────────────────────

  const handleFilterChange = useCallback((filter: string) => {
    // Stop all timers
    Object.keys(timerRefs.current).forEach((k) => {
      clearInterval(timerRefs.current[Number(k)]);
    });
    timerRefs.current = {};

    // Disconnect all observers
    Object.values(observerRefs.current).forEach((o) => o.disconnect());
    observerRefs.current = {};

    setActiveFilter(filter);
    const newUsed = new Set<number>();
    const pool = buildPool(filter, newUsed);
    const { newCards, newPool, newUsed: nu } = loadCards(filter, newUsed, pool);
    setCards(newCards);
    setQuestionPool(newPool);
    setUsedIds(nu);
    setHasMore(true);
    play('start');
  }, [buildPool, loadCards, play]);

  // ── Answer Handler ───────────────────────────────────────────────

  const handleAnswer = useCallback((cardIdx: number, optionIdx: number) => {
    setCards((prev) => {
      const card = prev[cardIdx];
      if (!card || card.chosen !== null || card.timedOut) return prev;
      return prev; // will update below
    });

    setCards((prev) => {
      const card = prev[cardIdx];
      if (!card || card.chosen !== null || card.timedOut) return prev;

      stopTimer(cardIdx);
      if (observerRefs.current[cardIdx]) {
        observerRefs.current[cardIdx].disconnect();
      }

      const isCorrect = optionIdx === card.question.ans;
      const remaining = card.timer.remaining;

      // Score calculation
      const newStreak = isCorrect ? streakRef.current + 1 : 0;
      const multiplier = Math.max(1, streakRef.current);
      const speedBonus = isCorrect ? Math.round(remaining * 3) : 0;
      const pts = isCorrect ? 10 * multiplier + speedBonus : 0;

      // Flash overlay
      flashKeyRef.current++;
      setTimeout(() => {
        setFlash({ type: isCorrect ? 'correct' : 'wrong', key: flashKeyRef.current });
        setTimeout(() => setFlash(null), 400);
      }, 0);

      // Pop emoji
      popKeyRef.current++;
      setTimeout(() => {
        setPopMsg({
          text: isCorrect ? '🎬' : '💀',
          key: popKeyRef.current,
          emoji: isCorrect ? '🎬' : '💀',
        });
        setTimeout(() => setPopMsg(null), 800);
      }, 0);

      // Speed pop
      if (isCorrect) {
        let speedText = '';
        if (remaining >= 12) speedText = `⚡ LIGHTNING! +${pts}pts`;
        else if (remaining >= 8) speedText = `🔥 SPEEDY! +${pts}pts`;
        else speedText = `✅ +${pts}pts`;
        setTimeout(() => {
          setPopMsg({ text: speedText, key: popKeyRef.current + 100, emoji: '' });
          setTimeout(() => setPopMsg(null), 1200);
        }, 900);
      }

      // Sound
      setTimeout(() => play(isCorrect ? 'correct' : 'wrong'), 0);

      // Score/streak updates
      setTimeout(() => {
        if (isCorrect) {
          setScore((s) => s + pts);
          scoreRef.current += pts;
          setCorrect((c) => c + 1);
          const ns = streakRef.current + 1;
          setStreak(ns);
          streakRef.current = ns;
          setBestStreak((b) => Math.max(b, ns));

          // Combo banners
          if ([3, 5, 8, 10].includes(ns)) {
            const labels: Record<number, string> = { 3: '🔥 ON FIRE! x3', 5: '💥 UNSTOPPABLE! x5', 8: '👑 ELITE! x8', 10: '🏆 LEGENDARY! x10' };
            setComboMsg(labels[ns]);
            setTimeout(() => setComboMsg(null), 1500);
            play('combo');
          }

          // Confetti every 3 correct in a row
          if (ns % 3 === 0) {
            setConfetti(makeConfetti());
            setTimeout(() => setConfetti([]), 1000);
          }
        } else {
          setStreak(0);
          streakRef.current = 0;
        }
        setTotalAnswered((t) => t + 1);
      }, 0);

      const next = [...prev];
      next[cardIdx] = {
        ...next[cardIdx],
        chosen: optionIdx,
        timer: { ...next[cardIdx].timer, running: false, done: true },
      };
      return next;
    });
  }, [stopTimer, play]);

  // ── Load More ────────────────────────────────────────────────────

  const handleLoadMore = useCallback(() => {
    const { newCards, newPool, newUsed } = loadCards(activeFilter, usedIds, questionPool);
    if (newCards.length === 0) {
      setHasMore(false);
      return;
    }
    setCards((prev) => [...prev, ...newCards]);
    setQuestionPool(newPool);
    setUsedIds(newUsed);
    play('start');
  }, [loadCards, activeFilter, usedIds, questionPool, play]);

  // ── Cleanup ──────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      Object.keys(timerRefs.current).forEach((k) => clearInterval(timerRefs.current[Number(k)]));
      Object.values(observerRefs.current).forEach((o) => o.disconnect());
    };
  }, []);

  // ── All cards answered? ──────────────────────────────────────────

  const allAnswered = cards.length > 0 && cards.every((c) => c.chosen !== null || c.timedOut);

  // ── Render ───────────────────────────────────────────────────────

  const streakColor = getStreakColor(streak);
  const filterTabs = [
    { id: 'all', label: 'All Films' },
    ...Object.values(MOVIES).map((m) => ({ id: m.id, label: m.title })),
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* ── Fixed Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6"
        style={{
          height: '60px',
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        {/* Logo */}
        <div className="font-display text-2xl sm:text-3xl text-gold-gradient tracking-wider">
          BLACK CINEMA IQ
        </div>

        {/* HUD */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="text-center">
            <div className="font-display text-xl sm:text-2xl text-gold-gradient leading-none">
              {score}
            </div>
            <div className="font-mono text-xs" style={{ color: '#555' }}>pts</div>
          </div>
          <div className="text-center">
            <div
              className="font-display text-xl sm:text-2xl leading-none"
              style={{ color: streakColor }}
            >
              🔥 {streak}
            </div>
            <div className="font-mono text-xs" style={{ color: '#555' }}>streak</div>
          </div>
          <div className="text-center hidden sm:block">
            <div className="font-display text-xl leading-none" style={{ color: '#F0EDE8' }}>
              {correct}/{totalAnswered}
            </div>
            <div className="font-mono text-xs" style={{ color: '#555' }}>correct</div>
          </div>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-3 py-1.5 rounded-xl font-display text-sm tracking-wider transition-all"
            style={{
              background: '#FFB80022',
              border: '1px solid #FFB80044',
              color: '#FFB800',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#FFB80033';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#FFB80022';
            }}
          >
            🏆 Board
          </button>
        </div>
      </header>

      {/* ── Progress Bar ── */}
      <div
        className="fixed z-40 left-0 right-0"
        style={{ top: '60px', height: '3px', background: '#1a1a1a' }}
      >
        <div
          style={{
            width: `${Math.min(100, (totalAnswered / 15) * 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FFB800, #FF6B00, #FF2D55)',
            boxShadow: '0 0 8px #FFB80088',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* ── Category Filter Bar ── */}
      <div
        className="fixed z-40 left-0 right-0 overflow-x-auto flex items-center gap-2 px-4 no-scrollbar"
        style={{
          top: '63px',
          height: '44px',
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          const color = tab.id === 'all' ? '#FFB800' : MOVIES[tab.id]?.color ?? '#FFB800';
          return (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className="whitespace-nowrap font-mono text-xs px-3 py-1 rounded-full transition-all flex-shrink-0"
              style={{
                color: isActive ? color : '#555',
                borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                background: isActive ? `${color}11` : 'transparent',
                paddingBottom: '2px',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Cards Feed ── */}
      <main
        className="max-w-2xl mx-auto px-4 pb-24 flex flex-col gap-4"
        style={{ paddingTop: '120px' }}
      >
        {cards.map((card, i) => (
          <div key={`${card.question.id}-${i}`} ref={setCardRef(i)}>
            <QuizCard
              cardState={card}
              cardIndex={i}
              onAnswer={handleAnswer}
              animDelay={(i % BATCH_SIZE) * 130}
            />
          </div>
        ))}

        {/* Load more */}
        {allAnswered && hasMore && (
          <button
            onClick={handleLoadMore}
            className="w-full py-4 rounded-2xl font-display text-lg tracking-widest transition-all animate-slide-in"
            style={{
              background: 'linear-gradient(135deg, #FFB80022, #FF6B0022)',
              border: '1px solid #FFB80044',
              color: '#FFB800',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'linear-gradient(135deg, #FFB80033, #FF6B0033)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'linear-gradient(135deg, #FFB80022, #FF6B0022)';
            }}
          >
            Next Question ›
          </button>
        )}

        {allAnswered && !hasMore && (
          <div
            className="text-center py-8 font-display text-2xl text-gold-gradient animate-slide-in"
          >
            🎬 YOU&apos;VE SEEN IT ALL
            <div className="font-body text-sm mt-2" style={{ color: '#555' }}>
              Final score: {score} pts • {correct}/{totalAnswered} correct
            </div>
          </div>
        )}
      </main>

      {/* ── Flash Overlay ── */}
      {flash && (
        <div
          key={flash.key}
          className="fixed inset-0 z-50 pointer-events-none animate-flash"
          style={{
            background:
              flash.type === 'correct'
                ? 'rgba(0,230,118,0.12)'
                : flash.type === 'wrong'
                ? 'rgba(255,45,85,0.12)'
                : 'rgba(255,107,0,0.10)',
          }}
        />
      )}

      {/* ── Pop Message ── */}
      {popMsg && (
        <div
          key={popMsg.key}
          className="fixed z-50 pointer-events-none animate-pop font-display text-4xl"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textShadow: '0 0 20px rgba(255,184,0,0.5)',
          }}
        >
          {popMsg.text}
        </div>
      )}

      {/* ── Combo Banner ── */}
      {comboMsg && (
        <div
          className="fixed z-50 pointer-events-none animate-combo font-display text-2xl tracking-widest text-gold-gradient"
          style={{
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          {comboMsg}
        </div>
      )}

      {/* ── Confetti ── */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="fixed z-50 pointer-events-none animate-conf-fall"
          style={{
            left: `${piece.x}%`,
            top: '20%',
            width: piece.size,
            height: piece.size,
            background: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}

      {/* ── Leaderboard Modal ── */}
      {showLeaderboard && (
        <LeaderboardModal
          score={score}
          streak={bestStreak}
          correct={correct}
          total={totalAnswered}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}
