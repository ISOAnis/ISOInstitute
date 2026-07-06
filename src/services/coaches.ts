import { supabase } from '../lib/supabase';
import { normalizePathwayId, type PathwayId } from '../data/pathways';
import {
  type DiscoverableCoach,
  ratingTierFromOverall,
  type CoachListingTier,
} from '../types/discoverableCoach';

interface DiscoverableCoachRow {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  /** normalized in mapRow */
  pathway_id: string;
  bio: string | null;
  current_role: string | null;
  years_of_experience: string | null;
  expertise_areas: string[] | null;
  photo_url: string | null;
  varsity_price_cents: number | null;
  listing_tier: CoachListingTier | null;
  success_rate: string | null;
  additional_perks: string[] | null;
  accepts_shadowing: boolean | null;
  shadowing_cadence_months: number | null;
  overall_rating: number | null;
}

function mapRow(row: DiscoverableCoachRow): DiscoverableCoach | null {
  const pathwayId = normalizePathwayId(row.pathway_id);
  if (!pathwayId) return null;

  const first = row.first_name?.trim() ?? '';
  const last = row.last_name?.trim() ?? '';
  const name = `${first} ${last}`.trim() || 'Coach';
  const overallRating = row.overall_rating ?? 75;
  const years = parseInt(row.years_of_experience ?? '0', 10);

  const gender = row.gender === 'female' ? 'female' : 'male';

  return {
    id: row.id,
    userId: row.user_id,
    name,
    gender,
    role: row.current_role ?? 'ISO Coach',
    bio: row.bio ?? '',
    pathwayId,
    yearsExperience: Number.isNaN(years) ? 0 : years,
    specialization: row.expertise_areas ?? [],
    varsityPrice: Math.round((row.varsity_price_cents ?? 4000) / 100),
    successRate: row.success_rate ?? undefined,
    tier: row.listing_tier ?? 'specialist',
    additionalPerks: row.additional_perks?.length ? row.additional_perks : undefined,
    photoUrl: row.photo_url,
    overallRating,
    acceptsShadowing: row.accepts_shadowing ?? true,
    shadowingCadenceMonths: row.shadowing_cadence_months ?? 1,
    ratingTier: ratingTierFromOverall(overallRating),
  };
}

export async function fetchDiscoverableCoaches(pathwayId?: PathwayId | string): Promise<DiscoverableCoach[]> {
  let query = supabase.from('discoverable_coaches').select('*');

  const normalized = pathwayId ? normalizePathwayId(pathwayId) ?? pathwayId : null;
  if (normalized) {
    query = query.eq('pathway_id', normalized);
  }

  const { data, error } = await query.order('overall_rating', { ascending: false });
  if (error) throw error;

  return (data as DiscoverableCoachRow[])
    .map(mapRow)
    .filter((coach): coach is DiscoverableCoach => coach !== null);
}

export async function fetchCoachById(coachId: string): Promise<DiscoverableCoach | null> {
  const { data, error } = await supabase
    .from('discoverable_coaches')
    .select('*')
    .eq('id', coachId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as DiscoverableCoachRow);
}

export async function fetchCoachByName(name: string): Promise<DiscoverableCoach | null> {
  const coaches = await fetchDiscoverableCoaches();
  const normalized = name.trim().toLowerCase();
  return coaches.find((c) => c.name.toLowerCase() === normalized) ?? null;
}
