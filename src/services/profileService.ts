import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type {
  CoachApplicationStatus,
  MembershipPlan,
  Profile,
  Subscription,
  UserRole,
} from '../types/database';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

const ADMIN_EMAIL = 'yhamu27@gmail.com';

/** Create profile + subscription if the signup trigger did not run. */
export async function ensureUserRecords(user: User): Promise<{
  profile: Profile;
  subscription: Subscription;
}> {
  let profile = await fetchProfile(user.id);
  let subscription = await fetchSubscription(user.id);
  const email = user.email ?? '';

  if (!profile) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email,
        is_admin: email.toLowerCase() === ADMIN_EMAIL,
      })
      .select()
      .single();

    if (error) throw error;
    profile = data;
  }

  if (!subscription) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan: 'walk-on',
      })
      .select()
      .single();

    if (error) throw error;
    subscription = data;
  }

  return { profile, subscription };
}

export async function updateActiveRole(userId: string, role: UserRole): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ active_role: role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addRoleToProfile(userId: string, role: UserRole): Promise<Profile> {
  const profile = await fetchProfile(userId);
  if (!profile) throw new Error('Profile not found');

  const roles = Array.from(new Set([...profile.roles, role]));
  const { data, error } = await supabase
    .from('profiles')
    .update({ roles, active_role: role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approveCoachApplication(
  coachUserId: string,
  adminUserId: string,
): Promise<void> {
  const now = new Date().toISOString();

  const { error: assessmentError } = await supabase
    .from('coach_assessments')
    .update({
      application_status: 'approved' as CoachApplicationStatus,
      reviewed_at: now,
      reviewed_by: adminUserId,
    })
    .eq('user_id', coachUserId);

  if (assessmentError) throw assessmentError;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      coach_onboarding_complete: true,
      coach_application_status: 'approved' as CoachApplicationStatus,
      active_role: 'coach',
    })
    .eq('id', coachUserId);

  if (profileError) throw profileError;

  const { error: coachProfileError } = await supabase
    .from('coach_profiles')
    .update({ is_discoverable: true })
    .eq('user_id', coachUserId);

  if (coachProfileError) throw coachProfileError;
}

export async function updateSubscriptionPlan(
  userId: string,
  plan: MembershipPlan,
): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ plan })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Sync Supabase state to legacy localStorage keys during migration. */
export function syncLegacyLocalStorage(profile: Profile, subscription: Subscription | null) {
  try {
    localStorage.setItem(
      'iso_demo_user',
      JSON.stringify({
        email: profile.email,
        roles: profile.roles,
        gender: profile.gender ?? undefined,
      }),
    );
    localStorage.setItem('iso_demo_portal', profile.active_role ?? 'player');
    localStorage.setItem('iso_demo_plan', subscription?.plan ?? 'walk-on');

    if (profile.player_onboarding_complete) {
      localStorage.setItem('iso_onboarding_complete', 'true');
    } else {
      localStorage.removeItem('iso_onboarding_complete');
    }

    if (profile.coach_application_status === 'pending') {
      localStorage.setItem('iso_coach_pending', 'true');
    } else {
      localStorage.removeItem('iso_coach_pending');
    }
  } catch {
    // Non-fatal during migration
  }
}

export function clearLegacyLocalStorage() {
  const keys = [
    'iso_demo_user',
    'iso_demo_portal',
    'iso_demo_plan',
    'iso_onboarding_complete',
    'iso_coach_pending',
    'iso_explorer',
    'iso-onboarding',
  ];
  keys.forEach((key) => localStorage.removeItem(key));
}
