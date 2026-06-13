import type { MembershipPlan } from './membership';

export const LOCKER_ROOM_MONTHLY_CALLS = 3;
export const LOCKER_ROOM_PRICE_USD = 15;
export const ISO_PASS_PLATFORM_FEE = 0.15;
/** @deprecated use ISO_PASS_PLATFORM_FEE */
export const ISO_VARSITY_PLATFORM_FEE = ISO_PASS_PLATFORM_FEE;
export const TRYOUT_MINUTES = 30;
/** @deprecated use TRYOUT_MINUTES */
export const DISCOVERY_CALL_MINUTES = TRYOUT_MINUTES;

export interface ExplorerUsage {
  /** Walk-on: one call per pathway per month */
  pathwayChats: Record<string, boolean>;
  /** Locker Room: coach IDs used this month (unique coaches only) */
  coachChats: string[];
  shadowUsedThisMonth: boolean;
  lastReset: string;
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function getExplorerUsage(): ExplorerUsage {
  try {
    const saved = localStorage.getItem('iso_explorer_usage');
    const month = currentMonth();
    if (!saved) {
      return { pathwayChats: {}, coachChats: [], shadowUsedThisMonth: false, lastReset: month };
    }
    const parsed = JSON.parse(saved) as Partial<ExplorerUsage> & { chats?: Record<string, number>; shadowingUsed?: number };
    if (parsed.lastReset !== month) {
      return { pathwayChats: {}, coachChats: [], shadowUsedThisMonth: false, lastReset: month };
    }
    return {
      pathwayChats: parsed.pathwayChats ?? {},
      coachChats: Array.isArray(parsed.coachChats) ? parsed.coachChats : [],
      shadowUsedThisMonth: parsed.shadowUsedThisMonth ?? (parsed.shadowingUsed ?? 0) >= 1,
      lastReset: month,
    };
  } catch {
    return { pathwayChats: {}, coachChats: [], shadowUsedThisMonth: false, lastReset: currentMonth() };
  }
}

export function saveExplorerUsage(usage: ExplorerUsage) {
  localStorage.setItem('iso_explorer_usage', JSON.stringify(usage));
}

export function chatUsedWithCoach(usage: ExplorerUsage, coachId: string): boolean {
  return usage.coachChats.includes(coachId);
}

export function chatUsedForPathway(usage: ExplorerUsage, pathwayId: string): boolean {
  return !!usage.pathwayChats[pathwayId];
}

export function discoveryCallsRemaining(plan: MembershipPlan, usage: ExplorerUsage): number {
  if (plan === 'locker-room') return Math.max(0, LOCKER_ROOM_MONTHLY_CALLS - usage.coachChats.length);
  return 0;
}

export function canScheduleCoachCall(
  plan: MembershipPlan,
  usage: ExplorerUsage,
  coachId: string,
  pathwayId: string,
): { allowed: boolean; reason?: string } {
  if (plan === 'locker-room') {
    if (usage.coachChats.includes(coachId)) {
      return { allowed: false, reason: 'ALREADY MET THIS COACH THIS MONTH' };
    }
    if (usage.coachChats.length >= LOCKER_ROOM_MONTHLY_CALLS) {
      return { allowed: false, reason: '3 TRY OUTS USED THIS MONTH' };
    }
    return { allowed: true };
  }
  if (plan === 'walk-on') {
    if (usage.pathwayChats[pathwayId]) {
      return { allowed: false, reason: 'CHAT USED FOR THIS PATHWAY' };
    }
    return { allowed: true };
  }
  return { allowed: true };
}

export function recordCoachCall(
  usage: ExplorerUsage,
  plan: MembershipPlan,
  coachId: string,
  pathwayId: string,
): ExplorerUsage {
  if (plan === 'locker-room') {
    return { ...usage, coachChats: [...usage.coachChats, coachId] };
  }
  if (plan === 'walk-on') {
    return { ...usage, pathwayChats: { ...usage.pathwayChats, [pathwayId]: true } };
  }
  return usage;
}
