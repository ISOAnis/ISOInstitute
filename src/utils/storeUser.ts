import { User, UserLevel, EarnedReward, getLevelIndex, LEVEL_ORDER } from '../types/store';
import { getUserPlan, getAssessedLevel, type MembershipPlan, type AssessedLevel } from './membership';

const ASSESSED_TO_STORE_LEVEL: Record<AssessedLevel, UserLevel> = {
  freshman: 'Freshman',
  jv: 'JV',
  varsity: 'Varsity',
  d1: 'D1',
  professional: 'D1',
};

const LEVEL_XP: Record<UserLevel, number> = {
  Freshman: 0,
  JV: 1000,
  Varsity: 3000,
  D1: 6000,
};

function unlockedLevelsFor(assessed: AssessedLevel): UserLevel[] {
  const current = ASSESSED_TO_STORE_LEVEL[assessed];
  const idx = getLevelIndex(current);
  return LEVEL_ORDER.filter(l => getLevelIndex(l) <= idx);
}

function buildEarnedRewards(unlocked: UserLevel[]): EarnedReward[] {
  const rewards: EarnedReward[] = [];
  for (const level of unlocked) {
    if (level === 'Freshman' || level === 'JV') {
      rewards.push(
        { id: `r-${level}-c`, levelUnlocked: level, itemId: null, itemType: 'clothing', claimedAt: null },
        { id: `r-${level}-a`, levelUnlocked: level, itemId: null, itemType: 'accessory', claimedAt: null },
      );
    }
  }
  return rewards;
}

export interface PortalStoreContext {
  user: User;
  plan: MembershipPlan;
  levelStorePreview: boolean;
}

export function buildStoreUserFromPortal(): PortalStoreContext {
  const plan = getUserPlan();
  const assessed = getAssessedLevel();
  const currentLevel = ASSESSED_TO_STORE_LEVEL[assessed];
  const unlocked = unlockedLevelsFor(assessed);
  const hasPass = plan === 'locker-room' || plan === 'varsity';

  let name = 'ISO Player';
  let email = '';
  try {
    const profile = JSON.parse(localStorage.getItem('player_profile_data') || '{}');
    if (profile.name) name = profile.name;
    if (profile.email) email = profile.email;
  } catch {}
  if (!email) {
    try {
      const demo = JSON.parse(localStorage.getItem('iso_demo_user') || '{}');
      email = demo.email ?? '';
    } catch {}
  }

  const nextIdx = getLevelIndex(currentLevel) + 1;
  const xpToNext = nextIdx < LEVEL_ORDER.length
    ? LEVEL_XP[LEVEL_ORDER[nextIdx]]
    : LEVEL_XP.D1;

  return {
    plan,
    levelStorePreview: plan === 'locker-room',
    user: {
      id: 'portal-user',
      name,
      email,
      hasLockerRoomPass: hasPass,
      currentLevel,
      xp: LEVEL_XP[currentLevel] + 200,
      xpToNextLevel: xpToNext,
      monthlyPurchaseCount: 0,
      monthlyPurchaseLimit: plan === 'varsity' ? 4 : 2,
      unlockedLevels: plan === 'varsity' ? unlocked : unlocked.slice(0, Math.min(unlocked.length, 2)),
      earnedRewards: plan === 'varsity' ? buildEarnedRewards(unlocked) : [],
    },
  };
}
