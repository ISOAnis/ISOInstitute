import type { Rank } from './types';

export interface RankStatus {
  count: number;
  /** Null until the first checked-in ISO. */
  current: Rank | null;
  next: Rank | null;
  isosToNext: number;
  /** 0 to 1 progress from the current level to the next. */
  progress: number;
}

export function rankFor(count: number, ladder: Rank[]): RankStatus {
  const reached = ladder.filter((r) => count >= r.minIsos);
  const current = reached[reached.length - 1] ?? null;
  const next = ladder.find((r) => r.minIsos > count) ?? null;
  const floor = current?.minIsos ?? 0;
  const progress = next ? (count - floor) / (next.minIsos - floor) : 1;
  return { count, current, next, isosToNext: next ? next.minIsos - count : 0, progress };
}
