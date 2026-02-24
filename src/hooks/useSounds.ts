'use client';
import { useRef, useCallback } from 'react';

type SoundType = 'correct' | 'wrong' | 'timeout' | 'tick' | 'combo' | 'start';

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  const playNote = useCallback((
    ctx: AudioContext,
    type: OscillatorType,
    freq: number,
    startTime: number,
    duration: number,
    gain: number,
    endFreq?: number
  ) => {
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      if (endFreq !== undefined) {
        osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);
      }

      gainNode.gain.setValueAtTime(gain, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // silent fail
    }
  }, []);

  const play = useCallback((sound: SoundType) => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      switch (sound) {
        case 'correct': {
          // Ascending two-note sine chime: C5 → G5 → C6
          playNote(ctx, 'sine', 523.25, now,        0.18, 0.18); // C5
          playNote(ctx, 'sine', 783.99, now + 0.12, 0.18, 0.18); // G5
          playNote(ctx, 'sine', 1046.5, now + 0.24, 0.20, 0.18); // C6
          break;
        }
        case 'wrong': {
          // Descending sawtooth buzz 220Hz → 110Hz
          playNote(ctx, 'sawtooth', 220, now, 0.35, 0.10, 110);
          break;
        }
        case 'timeout': {
          // 3 descending square beeps: 440/360/280Hz, 150ms each
          playNote(ctx, 'square', 440, now,        0.15, 0.08);
          playNote(ctx, 'square', 360, now + 0.17, 0.15, 0.08);
          playNote(ctx, 'square', 280, now + 0.34, 0.15, 0.08);
          break;
        }
        case 'tick': {
          // Soft sine click 800Hz, 50ms
          playNote(ctx, 'sine', 800, now, 0.05, 0.06);
          break;
        }
        case 'combo': {
          // 4-note upward arpeggio, staggered 80ms
          const notes = [523.25, 783.99, 1046.5, 1396.9]; // C5 G5 C6 F6
          notes.forEach((f, i) => {
            playNote(ctx, 'sine', f, now + i * 0.08, 0.20, 0.16);
          });
          break;
        }
        case 'start': {
          // Low sine hum 60Hz, 300ms
          playNote(ctx, 'sine', 60, now, 0.30, 0.15);
          playNote(ctx, 'sine', 120, now + 0.05, 0.25, 0.08);
          break;
        }
      }
    } catch {
      // audio is enhancement only, never breaks the game
    }
  }, [getCtx, playNote]);

  return { play };
}
