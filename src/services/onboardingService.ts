import { supabase } from '../lib/supabase';
import { fetchProfile } from './profileService';
import { hydrateProfileFromAssessment } from '../utils/playerProfile';
import type { MembershipPlan, UserRole } from '../types/database';
import { normalizePathwayId } from '../data/pathways';

type Answers = Record<string, unknown>;

interface PlayerResult {
  level: string;
  levelLabel: string;
  score: number;
  reasoning: string;
  breakthrough: string;
}

interface CoachResult {
  overall: number;
  tier: string;
  tierLabel: string;
  strengths: string[];
  opportunities: string[];
  reasoning: string;
}

export async function saveOnboardingProgress(
  userId: string,
  role: UserRole | 'explorer',
  screen: string,
  currentQ: number,
  answers: Answers,
) {
  const payload = {
    user_id: userId,
    role,
    screen: `${screen}:${currentQ}`,
    answers,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from('onboarding_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('role', role)
    .is('completed_at', null)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from('onboarding_sessions')
      .update(payload)
      .eq('id', existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('onboarding_sessions').insert(payload);
  if (error) throw error;
}

export async function completePlayerOnboarding(
  userId: string,
  answers: Answers,
  email: string,
  playerResult: PlayerResult,
  plan: MembershipPlan = 'walk-on',
) {
  const profile = hydrateProfileFromAssessment(answers, email);
  const pathwayId = normalizePathwayId((answers.pathway as string) ?? '') ?? (answers.pathway as string);
  const now = new Date().toISOString();

  const gender = profile.gender || null;
  const firstName = (answers.fname as string)?.trim() ?? '';
  const lastName = (answers.lname as string)?.trim() ?? '';
  const existingProfile = await fetchProfile(userId);
  const roles = Array.from(new Set([...(existingProfile?.roles ?? []), 'player'])) as Array<'player' | 'coach'>;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      gender,
      roles,
      active_role: 'player',
      player_onboarding_complete: true,
    })
    .eq('id', userId);

  if (profileError) throw profileError;

  const { error: playerProfileError } = await supabase.from('player_profiles').upsert({
    user_id: userId,
    school_year: profile.schoolYear,
    age: profile.age,
    locations: profile.locations,
    prefers_same_background: profile.prefersSameBackground,
    goals: profile.goals,
    timeframe: profile.timeframe,
    communication_preference: profile.communicationPreference,
    structure_preference: profile.structurePreference,
    motivation_level: profile.motivationLevel,
    top_values: profile.topValues,
    completion_pct: 100,
    updated_at: now,
  });

  if (playerProfileError) throw playerProfileError;

  const { error: assessmentError } = await supabase.from('player_assessments').upsert({
    user_id: userId,
    assessed_level: playerResult.level,
    score: playerResult.score,
    reasoning: playerResult.reasoning,
    breakthrough: playerResult.breakthrough,
    assessed_at: now,
  });

  if (assessmentError) throw assessmentError;

  const pathwayPayload =
    plan === 'locker-room' || plan === 'varsity'
      ? { locked_pathway_id: pathwayId, exploring_pathway_id: null }
      : { exploring_pathway_id: pathwayId, locked_pathway_id: null };

  const { error: pathwayError } = await supabase.from('player_pathways').upsert({
    user_id: userId,
    ...pathwayPayload,
    pathway_selection_completed: true,
    updated_at: now,
  });

  if (pathwayError) throw pathwayError;

  // Walk-on default; locker-room / varsity require admin (plan C)
  if (plan === 'walk-on') {
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({ plan: 'walk-on' })
      .eq('user_id', userId);
    if (subError) throw subError;
  }

  const { error: sessionError } = await supabase
    .from('onboarding_sessions')
    .update({ completed_at: now, answers })
    .eq('user_id', userId)
    .eq('role', 'player');

  if (sessionError) throw sessionError;
}

export async function completeExplorerOnboarding(userId: string, answers: Answers) {
  const now = new Date().toISOString();
  const existingProfile = await fetchProfile(userId);
  const roles = Array.from(new Set([...(existingProfile?.roles ?? []), 'player'])) as Array<'player' | 'coach'>;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      roles,
      active_role: 'player',
      player_onboarding_complete: true,
    })
    .eq('id', userId);

  if (profileError) throw profileError;

  const { error: subError } = await supabase
    .from('subscriptions')
    .update({ plan: 'walk-on' })
    .eq('user_id', userId);

  if (subError) throw subError;

  const { error: sessionError } = await supabase
    .from('onboarding_sessions')
    .update({ completed_at: now, answers })
    .eq('user_id', userId)
    .eq('role', 'explorer');

  if (sessionError) throw sessionError;
}

export async function completeCoachOnboarding(
  userId: string,
  answers: Answers,
  coachResult: CoachResult,
  email: string,
) {
  const now = new Date().toISOString();
  const firstName = (answers.fname as string)?.trim() ?? '';
  const lastName = (answers.lname as string)?.trim() ?? '';
  const genderRaw = (answers.c_gender as string)?.toLowerCase();
  const gender = genderRaw === 'female' ? 'female' : genderRaw === 'male' ? 'male' : null;
  const pathwayId = normalizePathwayId((answers.pathway as string) ?? '') ?? (answers.pathway as string);
  const existingProfile = await fetchProfile(userId);
  const roles = Array.from(new Set([...(existingProfile?.roles ?? []), 'coach'])) as Array<'player' | 'coach'>;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      gender,
      roles,
      active_role: 'coach',
      coach_application_status: 'pending',
    })
    .eq('id', userId);

  if (profileError) throw profileError;

  const { error: assessmentError } = await supabase.from('coach_assessments').upsert({
    user_id: userId,
    overall_rating: coachResult.overall,
    tier: coachResult.tier,
    tier_label: coachResult.tierLabel,
    strengths: coachResult.strengths,
    opportunities: coachResult.opportunities,
    reasoning: coachResult.reasoning,
    application_status: 'pending',
    assessed_at: now,
  });

  if (assessmentError) throw assessmentError;

  const { error: coachProfileError } = await supabase.from('coach_profiles').upsert({
    user_id: userId,
    pathway_id: pathwayId,
    is_discoverable: false,
    completion_pct: 100,
    card_display: {
      name: `${firstName} ${lastName}`.trim(),
      result: coachResult,
    },
    updated_at: now,
  });

  if (coachProfileError) throw coachProfileError;

  const { error: sessionError } = await supabase
    .from('onboarding_sessions')
    .update({ completed_at: now, answers })
    .eq('user_id', userId)
    .eq('role', 'coach');

  if (sessionError) throw sessionError;
}

export async function submitPathwayChangeRequest(
  userId: string,
  currentPathway: string,
  requestedPathway: string,
  justification: string,
) {
  const submittedAt = new Date();
  const autoApproveAt = new Date(submittedAt);
  autoApproveAt.setDate(autoApproveAt.getDate() + 7);

  const { error } = await supabase.from('pathway_change_requests').insert({
    player_id: userId,
    current_pathway: currentPathway,
    requested_pathway: requestedPathway,
    justification,
    status: 'pending',
    auto_approve_at: autoApproveAt.toISOString(),
    submitted_at: submittedAt.toISOString(),
  });

  if (error) throw error;
}
