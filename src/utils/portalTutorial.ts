import type { MembershipPlan } from './membership';

export interface PortalTutorialStep {
  title: string;
  description: string;
  /** data-tutorial-id on a DOM element to spotlight */
  target?: string;
  /** Portal section to navigate to before highlighting */
  section?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

export type PlayerTutorialScope = 'walk-on' | 'locker-room' | 'varsity';
export type CoachTutorialScope = 'base';

const STORAGE_PREFIX = 'iso_tutorial_v2';

export function tutorialStorageKey(role: 'coach' | 'player', scope: string) {
  return `${STORAGE_PREFIX}_${role}_${scope}`;
}

export function isTutorialComplete(role: 'coach' | 'player', scope: string): boolean {
  try {
    return localStorage.getItem(tutorialStorageKey(role, scope)) === 'true';
  } catch {
    return false;
  }
}

export function markTutorialComplete(role: 'coach' | 'player', scope: string) {
  try {
    localStorage.setItem(tutorialStorageKey(role, scope), 'true');
  } catch {}
}

export function getPlayerTutorialScope(plan: MembershipPlan): PlayerTutorialScope {
  if (plan === 'varsity') return 'varsity';
  if (plan === 'locker-room') return 'locker-room';
  return 'walk-on';
}

export function getPlayerTutorialSteps(scope: PlayerTutorialScope): PortalTutorialStep[] {
  return PLAYER_TUTORIALS[scope];
}

export function getCoachTutorialSteps(scope: CoachTutorialScope = 'base'): PortalTutorialStep[] {
  return COACH_TUTORIALS[scope];
}

export function getTutorialWelcomeTitle(
  role: 'coach' | 'player',
  scope: PlayerTutorialScope | CoachTutorialScope,
): string {
  if (role === 'coach') return 'Welcome to Your Coach Portal';
  if (scope === 'varsity') return 'Welcome to ISO Pass';
  if (scope === 'locker-room') return 'Locker Room — New Features';
  return 'Welcome to ISO Explorer';
}

const EXPLORER_WALK_ON: PortalTutorialStep[] = [
  {
    title: 'Your Explorer Home',
    description: 'Browse coaches across pathways, try out conversations, and find the right fit before you commit.',
  },
  {
    title: 'Explore Coaches',
    description: 'Pick a pathway and browse matched coaches. Walk-On members get one try-out per pathway each month.',
    target: 'explorer-nav-explore',
    section: 'explore',
    placement: 'right',
  },
  {
    title: 'ISO Community',
    description: 'Locker Room unlocks the ISO forum — share goal completions, encourage players across pathways, and get coach shoutouts.',
    target: 'explorer-nav-community',
    section: 'community',
    placement: 'right',
  },
  {
    title: 'ISO Store',
    description: 'Preview Locker Room gear and ISO Pass milestone rewards. Grab merch at events now, or upgrade to shop online.',
    target: 'explorer-nav-store',
    section: 'store',
    placement: 'right',
  },
  {
    title: 'My Profile',
    description: 'Keep your profile updated so coaches know who you are when you book a try-out.',
    target: 'explorer-nav-profile',
    section: 'profile',
    placement: 'right',
  },
  {
    title: 'Ready to Level Up?',
    description: 'Upgrade to Locker Room for more try-outs, goals, community access, and the ISO Store.',
    target: 'explorer-upgrade-locker-room',
    placement: 'top',
  },
];

const EXPLORER_LOCKER_ROOM: PortalTutorialStep[] = [
  {
    title: 'Locker Room Unlocked',
    description: 'You now have a committed pathway, more try-outs, and access to goals and the Locker Room chat.',
  },
  {
    title: 'My Coaches',
    description: 'Your pathway is locked in — this is where you manage try-outs and coach relationships in your lane.',
    target: 'explorer-nav-explore',
    section: 'explore',
    placement: 'right',
  },
  {
    title: 'My Goals',
    description: 'Track self-guided goals between sessions. Set targets and mark progress on your own schedule.',
    target: 'explorer-nav-goals',
    section: 'goals',
    placement: 'right',
  },
  {
    title: 'Locker Room Chat',
    description: 'Join pathway channels and connect with other players in your tier.',
    target: 'explorer-nav-locker-room',
    section: 'locker-room',
    placement: 'right',
  },
  {
    title: 'ISO Store',
    description: 'Your online ISO Store is now open — gear up with tier-appropriate items.',
    target: 'explorer-nav-store',
    section: 'store',
    placement: 'right',
  },
];

const VARSITY_PLAYER: PortalTutorialStep[] = [
  {
    title: 'ISO Pass Command Center',
    description: 'You have a dedicated coach, a full skill tree, real progress tracking, and direct messaging.',
  },
  {
    title: 'Portal Header',
    description: 'Your streak, pathway, and portal identity live here. Check in daily to build momentum.',
    target: 'player-chrome-bar',
    placement: 'bottom',
  },
  {
    title: 'Your Level Bar',
    description: 'Freshman through Pro — every game won moves you up. Expand to see what drives your tier.',
    target: 'player-tier-bar',
    section: 'dashboard',
    placement: 'bottom',
  },
  {
    title: 'Dashboard',
    description: 'Your command center — season stats, growth compass, and what to do next.',
    target: 'player-nav-dashboard',
    section: 'dashboard',
    placement: 'right',
  },
  {
    title: 'Skill Tree',
    description: 'Win games to unlock nodes on your pathway skill tree. Each victory opens new skills.',
    target: 'player-nav-skill-tree',
    section: 'skill-tree',
    placement: 'right',
  },
  {
    title: 'My Progress',
    description: 'Track games, buckets, and your tier bar as you climb from JV to Pro.',
    target: 'player-nav-progress',
    section: 'progress',
    placement: 'right',
  },
  {
    title: 'Messages',
    description: 'Chat directly with your coach — ask questions, share wins, and get feedback.',
    target: 'player-nav-messages',
    section: 'messages',
    placement: 'right',
  },
  {
    title: 'ISO Store',
    description: 'Spend your tier on ISO gear and unlock items as you level up.',
    target: 'player-nav-store',
    section: 'store',
    placement: 'right',
  },
  {
    title: 'My Profile',
    description: 'Keep your player card complete so your coach and the community know your story.',
    target: 'player-nav-profile',
    section: 'profile',
    placement: 'right',
  },
  {
    title: 'Locker Room',
    description: 'Jump into pathway channels and connect with other ISO Pass players anytime.',
    target: 'player-nav-locker-room',
    section: 'locker-room',
    placement: 'right',
  },
];

const COACH_BASE: PortalTutorialStep[] = [
  {
    title: 'Your Coaching Command Center',
    description: 'Manage players, grow your OVR, and build your brand — everything starts in the sidebar.',
  },
  {
    title: 'Portal Header',
    description: 'Track your daily streak and stay visible in the ISO ecosystem.',
    target: 'coach-chrome-bar',
    placement: 'bottom',
  },
  {
    title: 'Dashboard',
    description: 'Your home base — coach card, OVR, radar chart, and XP opportunities at a glance.',
    target: 'coach-nav-dashboard',
    section: 'dashboard',
    placement: 'right',
  },
  {
    title: 'Your OVR Bar',
    description: 'Your overall rating grows as you complete profile items, review players, and stay active.',
    target: 'coach-ovr-bar',
    section: 'dashboard',
    placement: 'bottom',
  },
  {
    title: 'My Players',
    description: 'Select a player to view games and buckets. Approve completions and leave feedback.',
    target: 'coach-nav-players',
    section: 'players',
    placement: 'right',
  },
  {
    title: 'Messages',
    description: 'Chat directly with your roster from the Messages section.',
    target: 'coach-nav-messages',
    section: 'messages',
    placement: 'right',
  },
  {
    title: 'AI Matching',
    description: 'Review match scores and accept player requests that fit your expertise.',
    target: 'coach-nav-matching',
    section: 'matching',
    placement: 'right',
  },
  {
    title: 'ISO Community',
    description: 'Share wins, encourage players across pathways, and build your coaching brand.',
    target: 'coach-nav-community',
    section: 'community',
    placement: 'right',
  },
  {
    title: 'Locker Room',
    description: 'Join pathway channels, contribute videos, and connect with the ISO ecosystem.',
    target: 'coach-nav-locker-room',
    section: 'locker-room',
    placement: 'right',
  },
  {
    title: 'Coach Store',
    description: 'Unlock tier-gated coaching gear as your OVR rises.',
    target: 'coach-nav-store',
    section: 'store',
    placement: 'right',
  },
  {
    title: 'My Profile',
    description: 'Finish your profile to get published on ISO and start attracting players.',
    target: 'coach-nav-profile',
    section: 'profile',
    placement: 'right',
  },
  {
    title: 'Daily Streak',
    description: 'Log in daily to keep your streak alive — consistency boosts your OVR over time.',
    target: 'coach-daily-streak',
    placement: 'left',
  },
];

const PLAYER_TUTORIALS: Record<PlayerTutorialScope, PortalTutorialStep[]> = {
  'walk-on': EXPLORER_WALK_ON,
  'locker-room': EXPLORER_LOCKER_ROOM,
  varsity: VARSITY_PLAYER,
};

const COACH_TUTORIALS: Record<CoachTutorialScope, PortalTutorialStep[]> = {
  base: COACH_BASE,
};
