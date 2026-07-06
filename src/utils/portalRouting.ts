import type { Profile } from '../types/database';

export type PortalPage = 'player-portal' | 'coach-portal' | 'join';

interface PortalRoutingInput {
  profile: Profile | null;
  isPlayerOnboarded: boolean;
  isCoachOnboarded: boolean;
  isCoachPending: boolean;
}

/** Where to send a returning user after login or session restore. */
export function resolvePortalDestination({
  profile,
  isPlayerOnboarded,
  isCoachOnboarded,
  isCoachPending,
}: PortalRoutingInput): PortalPage {
  if (!profile) return 'join';

  if (isCoachPending) return 'coach-portal';

  const activeRole = profile.active_role;
  if (activeRole === 'coach' && isCoachOnboarded) return 'coach-portal';
  if (activeRole === 'player' && isPlayerOnboarded) return 'player-portal';

  if (isCoachOnboarded) return 'coach-portal';
  if (isPlayerOnboarded) return 'player-portal';

  return 'join';
}

export const JOIN_ADD_ROLE_KEY = 'iso_join_add_role';
export const JOIN_INTENT_KEY = 'iso_join_intent';

export function markJoinAddRoleIntent() {
  localStorage.setItem(JOIN_ADD_ROLE_KEY, 'true');
  localStorage.removeItem(JOIN_INTENT_KEY);
}

export function peekJoinAddRoleIntent(): boolean {
  return localStorage.getItem(JOIN_ADD_ROLE_KEY) === 'true';
}

export function hasInProgressOnboarding(): boolean {
  try {
    const saved = localStorage.getItem('iso-onboarding');
    if (!saved) return false;
    const parsed = JSON.parse(saved) as { screen?: string };
    return parsed.screen === 'player' || parsed.screen === 'coach' || parsed.screen === 'explorer';
  } catch {
    return false;
  }
}

export function shouldSkipPortalRedirect(): boolean {
  const skip = localStorage.getItem(JOIN_ADD_ROLE_KEY) === 'true';
  if (skip) localStorage.removeItem(JOIN_ADD_ROLE_KEY);
  return skip;
}

export function getPortalRoutingInput(
  profile: Profile | null,
  flags: {
    isPlayerOnboarded: boolean;
    isCoachOnboarded: boolean;
    isCoachPending: boolean;
  },
): PortalRoutingInput {
  return { profile, ...flags };
}
