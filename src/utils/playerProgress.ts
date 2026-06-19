export interface PlayerTierDef {
  id: string;
  name: string;
  minGames: number;
  hex: string;
  darkHex: string;
}

export const PLAYER_TIERS: PlayerTierDef[] = [
  { id: 'freshman', name: 'Freshman', minGames: 0, hex: '#10b981', darkHex: '#065f46' },
  { id: 'jv', name: 'JV', minGames: 3, hex: '#3b82f6', darkHex: '#1e3a8a' },
  { id: 'varsity', name: 'Varsity', minGames: 6, hex: '#a855f7', darkHex: '#4c1d95' },
  { id: 'd1', name: 'D1', minGames: 10, hex: '#f97316', darkHex: '#7c2d12' },
  { id: 'professional', name: 'Pro', minGames: 15, hex: '#ea580c', darkHex: '#7c2d12' },
];

export interface PlayerTierSnapshot {
  tierId: string;
  tierName: string;
  tierIndex: number;
  tierHex: string;
  gamesWon: number;
  nextTier: PlayerTierDef | null;
  gamesToNext: number | null;
  progressPct: number;
  progressFrom: string;
  progressTo: string | null;
  isMaxTier: boolean;
}

import {
  resolvePlayerGrowthCompass,
  type GrowthContributorId,
  type PlayerGrowthCompassProfile,
} from './playerGrowthCompass';

export interface PlayerGrowthContributor {
  id: GrowthContributorId;
  label: string;
  earned: number;
  maxPoints: number;
  tip: string;
}

export interface PlayerProgressSnapshot extends PlayerTierSnapshot {
  contributors: PlayerGrowthContributor[];
  topOpportunity: PlayerGrowthContributor | null;
  radarScores: Record<string, number>;
  growthCompass: PlayerGrowthCompassProfile;
}

export function getPlayerTierSnapshot(gamesWon: number): PlayerTierSnapshot {
  let tierIndex = 0;
  for (let i = PLAYER_TIERS.length - 1; i >= 0; i--) {
    if (gamesWon >= PLAYER_TIERS[i].minGames) {
      tierIndex = i;
      break;
    }
  }

  const tier = PLAYER_TIERS[tierIndex];
  const nextTier = tierIndex < PLAYER_TIERS.length - 1 ? PLAYER_TIERS[tierIndex + 1] : null;
  const gamesToNext = nextTier ? Math.max(0, nextTier.minGames - gamesWon) : null;

  let progressPct = 100;
  if (nextTier) {
    const span = nextTier.minGames - tier.minGames;
    const earned = gamesWon - tier.minGames;
    progressPct = span > 0 ? Math.min(100, Math.round((earned / span) * 100)) : 0;
  }

  return {
    tierId: tier.id,
    tierName: tier.name,
    tierIndex,
    tierHex: tier.hex,
    gamesWon,
    nextTier,
    gamesToNext,
    progressPct,
    progressFrom: tier.name,
    progressTo: nextTier?.name ?? null,
    isMaxTier: !nextTier,
  };
}

export function buildPlayerContributors(
  gamesWon: number,
  bucketsScored: number,
  totalBuckets: number,
  winPercentage: number,
  skillNodesUnlocked: number,
  totalSkillNodes: number,
  pathwayId: string,
): PlayerGrowthContributor[] {
  const compass = resolvePlayerGrowthCompass(pathwayId);
  const bucketPct = totalBuckets > 0 ? Math.round((bucketsScored / totalBuckets) * 100) : 0;
  const skillPct = totalSkillNodes > 0 ? Math.round((skillNodesUnlocked / totalSkillNodes) * 100) : 0;

  const axis = (id: GrowthContributorId) => compass.axes[id];

  return [
    {
      id: 'games',
      label: axis('games').label,
      earned: Math.min(gamesWon, 15),
      maxPoints: 15,
      tip: axis('games').tip,
    },
    {
      id: 'buckets',
      label: axis('buckets').label,
      earned: Math.round((bucketPct / 100) * 10),
      maxPoints: 10,
      tip: axis('buckets').tip,
    },
    {
      id: 'skills',
      label: axis('skills').label,
      earned: Math.round((skillPct / 100) * 8),
      maxPoints: 8,
      tip: axis('skills').tip,
    },
    {
      id: 'consistency',
      label: axis('consistency').label,
      earned: Math.min(7, Math.round(winPercentage / 15)),
      maxPoints: 7,
      tip: axis('consistency').tip,
    },
    {
      id: 'coach',
      label: axis('coach').label,
      earned: gamesWon >= 1 ? Math.min(5, gamesWon) : 0,
      maxPoints: 5,
      tip: axis('coach').tip,
    },
    {
      id: 'community',
      label: axis('community').label,
      earned: Math.min(5, Math.floor(gamesWon / 2)),
      maxPoints: 5,
      tip: axis('community').tip,
    },
  ];
}

export function getPlayerProgressSnapshot(
  gamesWon: number,
  bucketsScored: number,
  totalBuckets: number,
  winPercentage: number,
  skillNodesUnlocked: number,
  totalSkillNodes: number,
  pathwayId: string,
): PlayerProgressSnapshot {
  const growthCompass = resolvePlayerGrowthCompass(pathwayId);
  const tier = getPlayerTierSnapshot(gamesWon);
  const contributors = buildPlayerContributors(
    gamesWon,
    bucketsScored,
    totalBuckets,
    winPercentage,
    skillNodesUnlocked,
    totalSkillNodes,
    pathwayId,
  );

  const topOpportunity = [...contributors]
    .sort((a, b) => (b.maxPoints - b.earned) - (a.maxPoints - a.earned))
    .find(c => c.earned < c.maxPoints) ?? null;

  const gamesContributor = contributors.find(c => c.id === 'games')!;
  const coachContributor = contributors.find(c => c.id === 'coach')!;
  const communityContributor = contributors.find(c => c.id === 'community')!;
  const axes = growthCompass.axes;

  const radarScores: Record<string, number> = {
    [axes.games.radarLabel]: gamesContributor.maxPoints > 0
      ? Math.round((gamesContributor.earned / 15) * 100) : 0,
    [axes.buckets.radarLabel]: totalBuckets > 0
      ? Math.round((bucketsScored / totalBuckets) * 100) : 0,
    [axes.skills.radarLabel]: totalSkillNodes > 0
      ? Math.round((skillNodesUnlocked / totalSkillNodes) * 100) : 0,
    [axes.consistency.radarLabel]: Math.min(100, winPercentage),
    [axes.coach.radarLabel]: coachContributor.maxPoints > 0
      ? Math.round((coachContributor.earned / 5) * 100) : 0,
    [axes.community.radarLabel]: communityContributor.maxPoints > 0
      ? Math.round((communityContributor.earned / 5) * 100) : 0,
  };

  return { ...tier, contributors, topOpportunity, radarScores, growthCompass };
}
