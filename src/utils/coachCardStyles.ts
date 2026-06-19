import type { CoachTier } from './coachProfile';

export const COACH_TIER_COLORS: Record<CoachTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  premium: '#a855f7',
};

export interface CoachTierBorderStyle {
  gradient: string;
  glow: string;
  animation: string;
}

/** Matches player portal CoachCardModal tier border treatment */
export const COACH_TIER_BORDER: Record<CoachTier, CoachTierBorderStyle> = {
  bronze: {
    gradient: 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)',
    glow: '0 0 16px rgba(205,127,50,0.35)',
    animation: 'none',
  },
  silver: {
    gradient: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
    glow: '0 0 16px rgba(209,213,219,0.3)',
    animation: 'none',
  },
  gold: {
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    glow: '0 0 25px rgba(234,179,8,0.7), 0 0 45px rgba(245,158,11,0.5)',
    animation: 'gold-glow 2s cubic-bezier(0.4,0,0.6,1) infinite',
  },
  premium: {
    gradient: 'linear-gradient(135deg, #9333ea 0%, #f97316 100%)',
    glow: '0 0 30px rgba(249,115,22,0.7), 0 0 50px rgba(147,51,234,0.5)',
    animation: 'glow-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
  },
};
