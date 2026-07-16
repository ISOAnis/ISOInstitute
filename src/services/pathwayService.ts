import { supabase } from '../lib/supabase';
import { normalizePathwayId } from '../data/pathways';
import type { MembershipPlan, PathwayChangeRequest, PlayerPathway } from '../types/database';
import {
  lockPathway as lockPathwayLocal,
  setExploringPathway as setExploringPathwayLocal,
} from '../utils/membership';

export async function fetchPlayerPathway(userId: string): Promise<PlayerPathway | null> {
  const { data, error } = await supabase
    .from('player_pathways')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Persist exploring pathway (walk-on browsing) and mirror to localStorage. */
export async function saveExploringPathway(userId: string, pathwayId: string): Promise<void> {
  const normalized = normalizePathwayId(pathwayId) ?? pathwayId;
  setExploringPathwayLocal(normalized);

  const { error } = await supabase.from('player_pathways').upsert({
    user_id: userId,
    exploring_pathway_id: normalized,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

/** Persist locked pathway (locker-room/varsity commit) and mirror to localStorage. */
export async function saveLockedPathway(userId: string, pathwayId: string): Promise<void> {
  const normalized = normalizePathwayId(pathwayId) ?? pathwayId;
  lockPathwayLocal(normalized);

  const { error } = await supabase.from('player_pathways').upsert({
    user_id: userId,
    locked_pathway_id: normalized,
    pathway_selection_completed: true,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

/** Change own plan via SECURITY DEFINER RPC (temporary until Stripe). */
export async function setOwnPlan(plan: MembershipPlan): Promise<void> {
  const { error } = await supabase.rpc('set_own_plan', { new_plan: plan });
  if (error) throw error;
}

const AUTO_APPROVE_DAYS = 7;

export async function fetchPendingPathwayChange(
  userId: string,
): Promise<PathwayChangeRequest | null> {
  const { data, error } = await supabase
    .from('pathway_change_requests')
    .select('*')
    .eq('player_id', userId)
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function submitPathwayChange(
  userId: string,
  currentPathway: string,
  requestedPathway: string,
  justification: string,
): Promise<PathwayChangeRequest> {
  const autoApproveAt = new Date();
  autoApproveAt.setDate(autoApproveAt.getDate() + AUTO_APPROVE_DAYS);

  const { data, error } = await supabase
    .from('pathway_change_requests')
    .insert({
      player_id: userId,
      current_pathway: normalizePathwayId(currentPathway) ?? currentPathway,
      requested_pathway: normalizePathwayId(requestedPathway) ?? requestedPathway,
      justification,
      auto_approve_at: autoApproveAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Resolve a pending request whose 7-day auto-approve window has passed.
 * Returns the new locked pathway id if one was applied, otherwise null.
 */
export async function resolveDuePathwayChange(): Promise<string | null> {
  const { data, error } = await supabase.rpc('resolve_due_pathway_change');
  if (error) throw error;
  if (data) lockPathwayLocal(data);
  return data ?? null;
}

/** Admin: approve or deny a pending request (applies the switch atomically). */
export async function reviewPathwayChange(
  requestId: string,
  decision: 'approved' | 'denied',
): Promise<void> {
  const { error } = await supabase.rpc('review_pathway_change', {
    request_id: requestId,
    decision,
  });
  if (error) throw error;
}
