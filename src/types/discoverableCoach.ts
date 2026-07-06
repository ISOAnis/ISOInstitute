import type { PathwayId } from '../data/pathways';

export type CoachListingTier = 'standard' | 'specialist' | 'premium';
export type ExplorerRatingTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type CoachGender = 'male' | 'female';

export interface DiscoverableCoach {
  id: string;
  userId: string;
  name: string;
  gender: CoachGender;
  role: string;
  bio: string;
  pathwayId: PathwayId;
  yearsExperience: number;
  specialization: string[];
  varsityPrice: number;
  successRate?: string;
  tier: CoachListingTier;
  additionalPerks?: string[];
  photoUrl?: string | null;
  overallRating: number;
  acceptsShadowing: boolean;
  shadowingCadenceMonths: number;
  /** Explorer portal display tier derived from overall rating */
  ratingTier: ExplorerRatingTier;
}

export interface CoachListItem {
  name: string;
  role: string;
  bio: string;
  varsityPrice: number;
  yearsExperience: number;
  specialization: string[];
  successRate?: string;
  tier: CoachListingTier;
  additionalPerks?: string[];
  id: string;
}

export function coachToListItem(coach: DiscoverableCoach): CoachListItem {
  return {
    id: coach.id,
    name: coach.name,
    role: coach.role,
    bio: coach.bio,
    varsityPrice: coach.varsityPrice,
    yearsExperience: coach.yearsExperience,
    specialization: coach.specialization,
    successRate: coach.successRate,
    tier: coach.tier,
    additionalPerks: coach.additionalPerks,
  };
}

export function varsityPriceFromRating(rating: number): number {
  if (rating >= 95) return 120;
  if (rating >= 90) return 100;
  if (rating >= 85) return 85;
  if (rating >= 80) return 75;
  return 60;
}

export function ratingTierFromOverall(rating: number): ExplorerRatingTier {
  if (rating >= 90) return 'Platinum';
  if (rating >= 80) return 'Gold';
  if (rating >= 70) return 'Silver';
  return 'Bronze';
}

/** Shape used by the Explorer portal coach cards */
export interface ExplorerCoachView {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  tier: ExplorerRatingTier;
  bio: string;
  skills: string[];
  pathwayId: string;
  gender: CoachGender;
  acceptsShadowing: boolean;
  shadowingCadenceMonths: number;
  varsityMonthlyPrice: number;
}

export function toExplorerCoachView(coach: DiscoverableCoach): ExplorerCoachView {
  return {
    id: coach.id,
    name: coach.name,
    title: coach.role,
    specialty: coach.specialization[0] ?? 'Mentorship',
    rating: coach.overallRating,
    tier: coach.ratingTier,
    bio: coach.bio,
    skills: coach.specialization,
    pathwayId: coach.pathwayId,
    gender: coach.gender,
    acceptsShadowing: coach.acceptsShadowing,
    shadowingCadenceMonths: coach.shadowingCadenceMonths,
    varsityMonthlyPrice: coach.varsityPrice,
  };
}
