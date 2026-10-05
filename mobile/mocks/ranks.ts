import type { Rank } from '@/data/types';

export const ranks: Rank[] = [
  { level: 'Freshman', minIsos: 1, unlock: 'Your player card' },
  { level: 'JV', minIsos: 5, unlock: 'Access to buy the ISO tee' },
  { level: 'Varsity', minIsos: 15, unlock: 'Earned pathway patch + Varsity gear access' },
  { level: 'D1', minIsos: 35, unlock: 'First access to The Court + invite-only dinners' },
  { level: 'Pro', minIsos: 60, unlock: 'Eligible to apply as a coach in your pathway' },
  { level: 'Hall of Fame', minIsos: 100, unlock: 'Jersey retired: numbered piece + your name on the wall' },
];

export const MAX_PATHWAY_SWITCHES_PER_MONTH = 2;
export const FREE_LATE_CANCELS_PER_MONTH = 1;
export const HOLD_AMOUNT_USD = 5;
export const NO_SHOW_AFTER_MIN = 30;
