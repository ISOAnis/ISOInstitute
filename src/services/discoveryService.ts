import { supabase } from '../lib/supabase';
import type { MembershipPlan } from '../types/database';
import type { ExplorerUsage } from '../utils/explorerUsage';
import {
  canScheduleCoachCall,
  recordCoachCall,
  TRYOUT_MINUTES,
} from '../utils/explorerUsage';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function mapUsageRow(row: {
  pathway_chats: Record<string, boolean> | null;
  coach_chat_ids: string[] | null;
  shadow_used: boolean | null;
  month: string;
}): ExplorerUsage {
  return {
    pathwayChats: row.pathway_chats ?? {},
    coachChats: row.coach_chat_ids ?? [],
    shadowUsedThisMonth: row.shadow_used ?? false,
    lastReset: row.month,
  };
}

export async function fetchExplorerUsage(userId: string): Promise<ExplorerUsage> {
  const month = currentMonth();
  const { data, error } = await supabase
    .from('usage_counters')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    return { pathwayChats: {}, coachChats: [], shadowUsedThisMonth: false, lastReset: month };
  }
  return mapUsageRow(data);
}

export async function saveExplorerUsage(userId: string, usage: ExplorerUsage): Promise<void> {
  const month = currentMonth();
  const { error } = await supabase.from('usage_counters').upsert({
    user_id: userId,
    month,
    pathway_chats: usage.pathwayChats,
    coach_chat_ids: usage.coachChats,
    shadow_used: usage.shadowUsedThisMonth,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

/** Clear this month's try-out usage and cancel scheduled bookings (testing / admin). */
export async function resetExplorerUsage(
  userId: string,
  options?: { coachId?: string },
): Promise<void> {
  const month = currentMonth();

  let bookingQuery = supabase
    .from('discovery_bookings')
    .update({ status: 'canceled' })
    .eq('player_id', userId)
    .eq('status', 'scheduled');

  if (options?.coachId) {
    bookingQuery = bookingQuery.eq('coach_id', options.coachId);
  }

  const { error: bookingError } = await bookingQuery;
  if (bookingError) throw bookingError;

  const { error: usageError } = await supabase
    .from('usage_counters')
    .delete()
    .eq('user_id', userId)
    .eq('month', month);

  if (usageError) throw usageError;
}

export async function recordDiscoveryTryout(
  userId: string,
  plan: MembershipPlan,
  coachId: string,
  pathwayId: string,
): Promise<ExplorerUsage> {
  const usage = await fetchExplorerUsage(userId);
  const check = canScheduleCoachCall(plan, usage, coachId, pathwayId);
  if (!check.allowed) {
    throw new Error(check.reason ?? 'Try-out not allowed');
  }
  const next = recordCoachCall(usage, plan, coachId, pathwayId);
  await saveExplorerUsage(userId, next);
  return next;
}

export interface CreateBookingInput {
  playerId: string;
  coachId: string;
  pathwayId: string;
  plan: MembershipPlan;
  scheduledAt: Date;
  durationMinutes?: number;
}

export async function createDiscoveryBooking(input: CreateBookingInput) {
  const { error } = await supabase.from('discovery_bookings').insert({
    player_id: input.playerId,
    coach_id: input.coachId,
    pathway_id: input.pathwayId,
    plan: input.plan,
    scheduled_at: input.scheduledAt.toISOString(),
    duration_minutes: input.durationMinutes ?? TRYOUT_MINUTES,
    status: 'scheduled',
  });

  if (error) throw error;

  await recordDiscoveryTryout(
    input.playerId,
    input.plan,
    input.coachId,
    input.pathwayId,
  );
}

/** Parse "9:00 AM" style slot on a given date into ISO timestamp */
export function parseScheduledAt(date: Date, timeSlot: string): Date {
  const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    const fallback = new Date(date);
    fallback.setHours(12, 0, 0, 0);
    return fallback;
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const scheduled = new Date(date);
  scheduled.setHours(hours, minutes, 0, 0);
  return scheduled;
}
