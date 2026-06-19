/** Coach OVR progression — intake baseline + live activity contributors */

import type { CoachTier } from './coachProfile';
import { getCoachResult, getCoachProfileData, resolveCoachIdentity } from './coachProfile';
import { normalizePathwayId } from '../data/pathways';

export interface CoachProgressContributor {
  id: string;
  label: string;
  maxPoints: number;
  earned: number;
  tip: string;
}

export interface CoachProgressSnapshot {
  overall: number;
  tier: CoachTier;
  tierLabel: string;
  /** Current OVR — left end of the bar */
  progressFrom: number;
  /** Next single OVR point — right end of the bar */
  progressTo: number | null;
  nextTierLabel: string | null;
  nextTierThreshold: number | null;
  /** 0–100 fill toward the next +1 OVR */
  progressPct: number;
  contributors: CoachProgressContributor[];
  topOpportunity: CoachProgressContributor | null;
}

const TIER_LABELS: Record<CoachTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  premium: 'Premium',
};

const NEXT_TIER: Partial<Record<CoachTier, { threshold: number; label: string }>> = {
  bronze: { threshold: 70, label: 'Silver' },
  silver: { threshold: 80, label: 'Gold' },
  gold: { threshold: 90, label: 'Premium' },
};

function tierFromOverall(overall: number): CoachTier {
  if (overall >= 90) return 'premium';
  if (overall >= 80) return 'gold';
  if (overall >= 70) return 'silver';
  return 'bronze';
}

function readProfileCompletion(): number {
  try {
    const raw = localStorage.getItem('coach_profile_completion');
    return raw ? Math.min(100, Number(raw)) : 0;
  } catch {
    return 0;
  }
}

function readActivityCounts() {
  const profile = getCoachProfileData();
  const profilePct = readProfileCompletion();
  const hasPhoto = !!localStorage.getItem('coach_profile_picture');
  const hasBio = Boolean(profile?.bio?.trim());
  const hasOutcomes = Boolean(profile?.successStories?.trim());
  const hasFaith = Boolean(profile?.faithIntegration?.trim());

  return {
    profilePct,
    hasPhoto,
    hasBio,
    hasOutcomes,
    hasFaith,
    sessionsCompleted: 12,
    playerReviews: 8,
    avgReview: 4.6,
    communityPosts: 3,
    videoContributions: 1,
    coachingNights: 2,
    workshopsHosted: 1,
    bucketsApproved: 6,
  };
}

function buildContributors(activity: ReturnType<typeof readActivityCounts>): CoachProgressContributor[] {
  const sessionPts = Math.min(20, Math.floor(activity.sessionsCompleted / 2));
  const reviewPts = Math.min(15, Math.floor(activity.playerReviews * 1.5));
  const communityPts = Math.min(12, activity.communityPosts * 3 + activity.coachingNights * 2);
  const videoPts = Math.min(10, activity.videoContributions * 5 + activity.workshopsHosted * 3);
  const profilePts = Math.min(15, Math.round(activity.profilePct * 0.12) + (activity.hasPhoto ? 2 : 0) + (activity.hasBio ? 2 : 0));
  const impactPts = Math.min(15, (activity.hasOutcomes ? 6 : 0) + (activity.hasFaith ? 4 : 0) + Math.min(5, activity.bucketsApproved));
  const consistencyPts = Math.min(13, activity.coachingNights + activity.workshopsHosted + (activity.sessionsCompleted >= 10 ? 4 : 2));

  return [
    {
      id: 'sessions',
      label: 'Sessions completed',
      maxPoints: 20,
      earned: sessionPts,
      tip: 'Consistent player sessions are the strongest signal for OVR growth.',
    },
    {
      id: 'reviews',
      label: 'Player reviews',
      maxPoints: 15,
      earned: reviewPts,
      tip: 'Positive feedback from players directly lifts your overall rating.',
    },
    {
      id: 'profile',
      label: 'Profile completeness',
      maxPoints: 15,
      earned: profilePts,
      tip: 'A complete profile with photo and bio improves matching and visibility.',
    },
    {
      id: 'impact',
      label: 'Documented impact',
      maxPoints: 15,
      earned: impactPts,
      tip: 'Success stories, bucket approvals, and faith integration show real outcomes.',
    },
    {
      id: 'community',
      label: 'Community contribution',
      maxPoints: 12,
      earned: communityPts,
      tip: 'ISO Community posts and coaching nights build your reputation.',
    },
    {
      id: 'content',
      label: 'Locker Room content',
      maxPoints: 10,
      earned: videoPts,
      tip: 'Video contributions and workshops earn visibility across pathways.',
    },
    {
      id: 'consistency',
      label: 'Consistency',
      maxPoints: 13,
      earned: consistencyPts,
      tip: 'Regular engagement over time unlocks Gold and Premium tiers.',
    },
  ];
}

export function getCoachProgressSnapshot(): CoachProgressSnapshot {
  const result = getCoachResult();
  const overall = result?.overall ?? 74;
  const tier = result?.tier ?? tierFromOverall(overall);
  const tierLabel = result?.tierLabel ?? TIER_LABELS[tier];
  const next = NEXT_TIER[tier] ?? null;

  const contributors = buildContributors(readActivityCounts());
  const sorted = [...contributors].sort((a, b) => (b.maxPoints - b.earned) - (a.maxPoints - a.earned));
  const topOpportunity = sorted.find(c => c.earned < c.maxPoints) ?? null;

  const nextOverall = overall < 99 ? overall + 1 : null;
  const totalEarned = contributors.reduce((s, c) => s + c.earned, 0);
  const totalMax = contributors.reduce((s, c) => s + c.maxPoints, 0);
  const progressPct = nextOverall && totalMax > 0
    ? Math.min(100, Math.round((totalEarned / totalMax) * 100))
    : nextOverall ? 0 : 100;

  return {
    overall,
    tier,
    tierLabel,
    progressFrom: overall,
    progressTo: nextOverall,
    nextTierLabel: next?.label ?? null,
    nextTierThreshold: next?.threshold ?? null,
    progressPct,
    contributors,
    topOpportunity,
  };
}

export function getCoachPathwayChannelId(): string {
  const identity = resolveCoachIdentity();
  return normalizePathwayId(identity.pathwayId) ?? 'deen';
}
