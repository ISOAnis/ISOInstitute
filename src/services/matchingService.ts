import { supabase } from '../lib/supabase';
import { getPathwayName } from '../data/pathways';
import type {
  DbMatchRequest,
  MatchQuestionnaire,
  MembershipPlan,
} from '../types/database';

export interface MatchRequestWithPlayer extends DbMatchRequest {
  player_name: string;
  player_email: string;
  player_avatar_url: string | null;
  pathway_id: string | null;
  pathway_name: string;
}

function asQuestionnaire(raw: unknown): MatchQuestionnaire {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as MatchQuestionnaire;
  }
  return {};
}

/** Heuristic score when we don't have a full style questionnaire yet. */
export function scoreMatchRequest(input: {
  playerPathwayId?: string | null;
  coachPathwayId?: string | null;
  questionnaire?: MatchQuestionnaire;
}): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 55;

  if (
    input.playerPathwayId &&
    input.coachPathwayId &&
    input.playerPathwayId === input.coachPathwayId
  ) {
    score += 25;
    reasons.push('Same pathway — strong domain alignment');
  } else if (input.playerPathwayId && input.coachPathwayId) {
    score += 8;
    reasons.push('Cross-pathway interest with complementary coaching');
  }

  const q = input.questionnaire ?? {};
  if (q.goals && String(q.goals).trim().length > 20) {
    score += 8;
    reasons.push('Clear goals in their request');
  }
  if (q.commitment && String(q.commitment).trim().length > 20) {
    score += 7;
    reasons.push('Thoughtful commitment statement');
  }
  if (q.timeframe && /5-10|10|plus/i.test(String(q.timeframe))) {
    score += 5;
    reasons.push('High weekly time commitment');
  }

  reasons.push('Ready for ISO Pass coaching after discovery');
  return { score: Math.min(98, score), reasons: reasons.slice(0, 5) };
}

export async function submitMatchRequest(input: {
  playerId: string;
  coachId: string;
  plan?: MembershipPlan;
  playerPathwayId?: string | null;
  coachPathwayId?: string | null;
  questionnaire?: MatchQuestionnaire;
}): Promise<DbMatchRequest> {
  const { score, reasons } = scoreMatchRequest({
    playerPathwayId: input.playerPathwayId,
    coachPathwayId: input.coachPathwayId,
    questionnaire: input.questionnaire,
  });

  const { data, error } = await supabase
    .from('match_requests')
    .insert({
      player_id: input.playerId,
      coach_id: input.coachId,
      plan: input.plan ?? 'varsity',
      match_score: score,
      match_reasons: reasons,
      questionnaire: input.questionnaire ?? {},
    })
    .select()
    .single();

  if (error) {
    // Unique pending request — treat as success by returning the existing one
    if (error.code === '23505') {
      const { data: existing, error: existingError } = await supabase
        .from('match_requests')
        .select('*')
        .eq('player_id', input.playerId)
        .eq('coach_id', input.coachId)
        .eq('status', 'pending')
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing) return existing;
    }
    throw error;
  }

  return data;
}

/** Pending requests for the signed-in coach, with player profile fields. */
export async function fetchCoachMatchRequests(): Promise<MatchRequestWithPlayer[]> {
  const { data, error } = await supabase.rpc('get_coach_match_requests');
  if (error) throw error;

  return (data ?? []).map((row) => {
    const name =
      [row.player_first_name, row.player_last_name].filter(Boolean).join(' ') ||
      row.player_email ||
      'Player';
    return {
      id: row.id,
      player_id: row.player_id,
      coach_id: row.coach_id,
      plan: row.plan as MembershipPlan,
      status: row.status as DbMatchRequest['status'],
      match_score: row.match_score,
      match_reasons: row.match_reasons ?? [],
      questionnaire: asQuestionnaire(row.questionnaire),
      created_at: row.created_at,
      responded_at: row.responded_at,
      player_name: name,
      player_email: row.player_email ?? '',
      player_avatar_url: row.player_avatar_url ?? null,
      pathway_id: row.pathway_id,
      pathway_name: row.pathway_id ? getPathwayName(row.pathway_id) : 'Exploring pathways',
    };
  });
}

export async function respondToMatch(
  requestId: string,
  decision: 'accepted' | 'declined',
): Promise<void> {
  const { error } = await supabase.rpc('respond_to_match', {
    request_id: requestId,
    decision,
  });
  if (error) throw error;
}

export type PlayerMatchStatus = 'none' | 'pending' | 'accepted';

/** Latest open/accepted match status per coach for the signed-in player. */
export async function fetchPlayerMatchStatuses(
  playerId: string,
): Promise<Record<string, PlayerMatchStatus>> {
  const { data, error } = await supabase
    .from('match_requests')
    .select('coach_id, status, created_at')
    .eq('player_id', playerId)
    .in('status', ['pending', 'accepted'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  const statuses: Record<string, PlayerMatchStatus> = {};
  for (const row of data ?? []) {
    if (statuses[row.coach_id]) continue; // keep newest
    statuses[row.coach_id] = row.status === 'accepted' ? 'accepted' : 'pending';
  }
  return statuses;
}
