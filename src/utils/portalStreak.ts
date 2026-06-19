/** Daily portal visit streak — coach & player tracked separately */

export interface PortalStreak {
  count: number;
  lastDate: string;
}

const KEYS = {
  coach: 'iso_coach_daily_streak',
  player: 'iso_player_daily_streak',
} as const;

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function previousDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const prev = new Date(y, m - 1, d);
  prev.setDate(prev.getDate() - 1);
  return localDateKey(prev);
}

function loadStreak(role: 'coach' | 'player'): PortalStreak {
  try {
    const raw = localStorage.getItem(KEYS[role]);
    if (!raw) return { count: 0, lastDate: '' };
    const parsed = JSON.parse(raw) as PortalStreak;
    return {
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      lastDate: typeof parsed.lastDate === 'string' ? parsed.lastDate : '',
    };
  } catch {
    return { count: 0, lastDate: '' };
  }
}

function saveStreak(role: 'coach' | 'player', streak: PortalStreak) {
  try {
    localStorage.setItem(KEYS[role], JSON.stringify(streak));
  } catch {
    // ignore quota errors
  }
}

/** Record today's visit and return updated streak (idempotent per day) */
export function recordPortalVisit(role: 'coach' | 'player'): PortalStreak {
  const today = localDateKey();
  const stored = loadStreak(role);

  if (stored.lastDate === today) {
    return { ...stored, count: Math.max(stored.count, 1) };
  }

  const yesterday = previousDateKey(today);
  const next: PortalStreak = {
    count: stored.lastDate === yesterday ? stored.count + 1 : 1,
    lastDate: today,
  };
  saveStreak(role, next);
  return next;
}

export function getPortalStreak(role: 'coach' | 'player'): PortalStreak {
  const today = localDateKey();
  const stored = loadStreak(role);
  if (!stored.lastDate) return { count: 0, lastDate: '' };

  if (stored.lastDate === today) return stored;

  const yesterday = previousDateKey(today);
  if (stored.lastDate === yesterday) return stored;

  return { count: 0, lastDate: stored.lastDate };
}
