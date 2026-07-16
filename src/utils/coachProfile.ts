/** Coach intake → portal profile hydration (mirrors playerProfile.ts pattern) */

import type { CoachPhotoFrame } from './coachPhotoStorage';
import { DEFAULT_PHOTO_FRAME, loadPhotoFrame, savePhotoFrame } from './coachPhotoStorage';
import { PATHWAY_BY_ID, normalizePathwayId, type PathwayId } from '../data/pathways';
import type { DbCoachProfile, Profile } from '../types/database';

const PATHWAY_HEX: Record<PathwayId, string> = {
  deen: '#10b981',
  health: '#ef4444',
  medicine: '#3b82f6',
  engineering: '#a855f7',
  entrepreneurship: '#f97316',
  global: '#06b6d4',
};

export type CoachTier = 'bronze' | 'silver' | 'gold' | 'premium';

export interface CoachResultData {
  overall: number;
  tier: CoachTier;
  tierLabel: string;
  strengths: string[];
  opportunities: string[];
  reasoning: string;
}

export interface CoachIdentity {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  pathwayId: string;
  pathwayName: string;
  pathwayColor: string;
  gender?: 'male' | 'female';
}

export interface CoachProfileData {
  bio: string;
  yearsOfExperience: string;
  currentRole: string;
  locations: { lat: number; lng: number; label: string }[];
  expertiseAreas: string[];
  specificSkills: string[];
  industryExperience: string[];
  coachingStyle: 'hands-on' | 'advisory' | 'balanced' | '';
  communicationStyle: 'direct' | 'supportive' | 'balanced' | '';
  structurePreference: 'structured' | 'flexible' | 'adaptive' | '';
  weeklyHoursAvailable: string;
  preferredMeetingTimes: string[];
  maxPlayers: string;
  idealPlayerTraits: string[];
  coachingGoals: string;
  successStories: string;
  coreValues: string[];
  faithIntegration: string;
  motivations: string;
  linkedin?: string;
  references?: string;
}

export interface CoachCardDisplay {
  name: string;
  pathwayName: string;
  role: string;
  years: number;
  photo: string | null;
  photoFrame?: CoachPhotoFrame;
  skillTags: string[];
  outcomeCount: number;
  result: CoachResultData;
}

type Answers = Record<string, unknown>;

const JOIN_PATHWAY_META: Record<string, { name: string; color: string }> = {
  builder: { name: 'Builder', color: '#a855f7' },
  seeker: { name: 'Seeker', color: '#10b981' },
  healer: { name: 'Healer', color: '#3b82f6' },
  reformer: { name: 'Reformer', color: '#06b6d4' },
  founder: { name: 'Founder', color: '#f97316' },
  warrior: { name: 'Warrior', color: '#ef4444' },
};

function pathwayMeta(pathwayId: string) {
  return JOIN_PATHWAY_META[pathwayId] ?? { name: 'Coaching', color: '#10b981' };
}

function parseName(answers: Answers) {
  const fname = (answers.fname as string)?.trim() ?? '';
  const lname = (answers.lname as string)?.trim() ?? (answers.c_name as string)?.trim() ?? '';
  const fullName = `${fname} ${lname}`.trim() || 'Coach';
  return { firstName: fname || fullName.split(' ')[0], lastName: lname, fullName };
}

function inferCoachingStyle(s2: string): CoachProfileData['coachingStyle'] {
  if (s2.includes('direct')) return 'hands-on';
  if (s2.includes('Refer')) return 'advisory';
  return 'balanced';
}

function inferCommunicationStyle(s1: string): CoachProfileData['communicationStyle'] {
  if (s1.includes('private')) return 'direct';
  if (s1.includes('publicly')) return 'supportive';
  return 'balanced';
}

function inferStructurePreference(s2: string): CoachProfileData['structurePreference'] {
  if (s2.includes('direct')) return 'structured';
  if (s2.includes('more time')) return 'flexible';
  return 'adaptive';
}

export function hydrateCoachProfileFromAssessment(
  answers: Answers,
  result: CoachResultData,
  email?: string,
): { identity: CoachIdentity; profile: CoachProfileData; card: CoachCardDisplay } {
  const { firstName, lastName, fullName } = parseName(answers);
  const pathwayId = (answers.c_pathway as string) ?? 'seeker';
  const meta = pathwayMeta(pathwayId);
  const genderRaw = (answers.c_gender as string) ?? '';
  const gender = genderRaw.toLowerCase() === 'female' ? 'female' as const
    : genderRaw.toLowerCase() === 'male' ? 'male' as const : undefined;

  const years = (answers.c_years as number) ?? 0;
  const role = (answers.c_role as string) ?? '';
  const credentials = (answers.c_credentials as string[]) ?? [];
  const outcomes = (answers.c_outcomes as string[]) ?? [];
  const rawSkills = (answers.c_skills as string) ?? '';
  const specificSkills = rawSkills
    ? rawSkills.split(',').map(s => s.trim()).filter(Boolean)
    : result.strengths.slice(0, 5);
  const valuesAnswer = (answers.c_values as string) ?? '';
  const humilityAnswer = (answers.c_humility as string) ?? '';
  const references = (answers.c_references as string) ?? '';
  const linkedin = (answers.c_linkedin as string) ?? '';
  const photo = (answers.c_photo as string) ?? null;
  const photoFrame = (answers.c_photo_frame as CoachPhotoFrame | undefined) ?? DEFAULT_PHOTO_FRAME;
  const coachEmail = (answers.c_email as string) ?? email ?? '';

  const s1 = (answers.c_s1 as string) ?? '';
  const s2 = (answers.c_s2 as string) ?? '';

  const expertiseAreas = [
    meta.name,
    ...credentials.slice(0, 3).map(c => c.split(' ').slice(0, 3).join(' ')),
  ].filter(Boolean);

  const bioParts = [
    role && `${role}.`,
    years > 0 && `${years} year${years !== 1 ? 's' : ''} of coaching experience.`,
    credentials.length > 0 && `Credentials: ${credentials.slice(0, 3).join(', ')}.`,
    outcomes.length > 0 && `Documented outcomes include ${outcomes.slice(0, 2).join(' and ')}.`,
  ].filter(Boolean);

  const profile: CoachProfileData = {
    bio: bioParts.join(' ') || result.reasoning,
    yearsOfExperience: years > 0 ? `${years} years` : '',
    currentRole: role,
    locations: [],
    expertiseAreas,
    specificSkills,
    industryExperience: outcomes,
    coachingStyle: inferCoachingStyle(s2),
    communicationStyle: inferCommunicationStyle(s1),
    structurePreference: inferStructurePreference(s2),
    weeklyHoursAvailable: '',
    preferredMeetingTimes: [],
    maxPlayers: '',
    idealPlayerTraits: [],
    coachingGoals: outcomes.length > 0
      ? `Help players achieve outcomes like: ${outcomes.slice(0, 3).join('; ')}.`
      : '',
    successStories: references || (outcomes.length > 0 ? outcomes.join('. ') : ''),
    coreValues: valuesAnswer.includes('All of the above')
      ? ['Service', 'Integrity', 'Community', 'Humility']
      : ['Integrity', 'Service', 'Growth Mindset'].filter(Boolean),
    faithIntegration: valuesAnswer,
    motivations: [valuesAnswer, humilityAnswer].filter(Boolean).join(' '),
    linkedin,
    references,
  };

  const identity: CoachIdentity = {
    firstName,
    lastName,
    fullName,
    email: coachEmail,
    pathwayId,
    pathwayName: meta.name,
    pathwayColor: meta.color,
    gender,
  };

  const skillTags = specificSkills.slice(0, 3);

  const card: CoachCardDisplay = {
    name: fullName,
    pathwayName: meta.name,
    role,
    years,
    photo,
    photoFrame,
    skillTags,
    outcomeCount: outcomes.length,
    result,
  };

  return { identity, profile, card };
}

function computeProfileCompletion(profile: CoachProfileData, hasPhoto: boolean): number {
  const checks: boolean[] = [
    Boolean(profile.bio?.trim()),
    Boolean(profile.yearsOfExperience?.trim()),
    Boolean(profile.currentRole?.trim()),
    profile.expertiseAreas.length > 0,
    profile.specificSkills.length > 0,
    profile.coachingStyle !== '',
    profile.communicationStyle !== '',
    profile.structurePreference !== '',
    profile.coreValues.length > 0,
    Boolean(profile.faithIntegration?.trim()),
    Boolean(profile.motivations?.trim()),
    Boolean(profile.coachingGoals?.trim()),
    hasPhoto,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function saveCoachProfileFromAssessment(
  answers: Answers,
  result: CoachResultData,
  email?: string,
) {
  const { identity, profile, card } = hydrateCoachProfileFromAssessment(answers, result, email);

  localStorage.setItem('iso_coach_identity', JSON.stringify(identity));
  localStorage.setItem('iso_coach_result', JSON.stringify(result));
  localStorage.setItem('coach_profile_data', JSON.stringify(profile));
  localStorage.setItem('iso_coach_card', JSON.stringify(card));

  if (card.photo) {
    localStorage.setItem('coach_profile_picture', card.photo);
  }
  if (card.photoFrame) {
    savePhotoFrame(card.photoFrame);
  }

  const completion = computeProfileCompletion(profile, Boolean(card.photo));
  localStorage.setItem('coach_profile_completion', String(completion));

  if (identity.gender) {
    try {
      const saved = localStorage.getItem('iso_demo_user');
      const user = saved ? JSON.parse(saved) : { email: identity.email, roles: ['coach'] };
      user.gender = identity.gender;
      user.roles = ['coach'];
      if (identity.email) user.email = identity.email;
      localStorage.setItem('iso_demo_user', JSON.stringify(user));
    } catch {}
  }

  return { identity, profile, card, completion };
}

export function getCoachIdentity(): CoachIdentity | null {
  try {
    const raw = localStorage.getItem('iso_coach_identity');
    if (!raw) return null;
    return JSON.parse(raw) as CoachIdentity;
  } catch {
    return null;
  }
}

export function getCoachResult(): CoachResultData | null {
  try {
    const raw = localStorage.getItem('iso_coach_result');
    if (!raw) return null;
    return JSON.parse(raw) as CoachResultData;
  } catch {
    return null;
  }
}

export function getCoachCardDisplay(): CoachCardDisplay | null {
  try {
    const raw = localStorage.getItem('iso_coach_card');
    if (!raw) return null;
    return JSON.parse(raw) as CoachCardDisplay;
  } catch {
    return null;
  }
}

export function getCoachProfileData(): CoachProfileData | null {
  try {
    const raw = localStorage.getItem('coach_profile_data');
    if (!raw) return null;
    return JSON.parse(raw) as CoachProfileData;
  } catch {
    return null;
  }
}

export function isCoachCardPendingReview(): boolean {
  try {
    return !!localStorage.getItem('iso_coach_pending');
  } catch {
    return false;
  }
}

/** Demo fallback when portal opened without onboarding */
export const DEMO_COACH_IDENTITY: CoachIdentity = {
  firstName: 'Imam',
  lastName: 'Abdullah Rahman',
  fullName: 'Imam Abdullah Rahman',
  email: 'demo@coach.iso',
  pathwayId: 'seeker',
  pathwayName: 'Seeker',
  pathwayColor: '#10b981',
};

export const DEMO_COACH_RESULT: CoachResultData = {
  overall: 74,
  tier: 'silver',
  tierLabel: 'Silver',
  strengths: ['Meaningful coaching experience', 'Strong values alignment'],
  opportunities: ['Document your coaching outcomes more concretely'],
  reasoning: 'Experienced Seeker pathway coach with strong character signals.',
};

export function resolveCoachIdentity(): CoachIdentity {
  return getCoachIdentity() ?? DEMO_COACH_IDENTITY;
}

function isDemoCoachIdentity(identity: CoachIdentity | null | undefined): boolean {
  if (!identity) return true;
  return (
    identity.email === 'demo@coach.iso' ||
    identity.fullName === DEMO_COACH_IDENTITY.fullName ||
    identity.firstName === 'Imam'
  );
}

/** Wipe demo coach localStorage so it cannot override a real Supabase coach. */
export function clearDemoCoachLocalStorage() {
  try {
    const stored = getCoachIdentity();
    if (isDemoCoachIdentity(stored)) {
      localStorage.removeItem('iso_coach_identity');
      localStorage.removeItem('iso_coach_card');
      localStorage.removeItem('iso_coach_result');
      localStorage.removeItem('coach_profile_data');
    }
    localStorage.removeItem('iso_coach_pending');
  } catch {
    // Non-fatal
  }
}

export interface CoachAssessmentSnapshot {
  overall_rating: number;
  tier: CoachTier;
  tier_label: string | null;
  strengths: string[];
  opportunities: string[];
  reasoning: string | null;
  application_status: string;
}

/**
 * Build coach portal identity + card strictly from Supabase.
 * Never falls back to the Imam/Seeker demo identity.
 */
export function hydrateCoachIdentityFromDb(
  profile: Profile | null,
  coachProfile: DbCoachProfile | null,
  assessment: CoachAssessmentSnapshot | null = null,
): { identity: CoachIdentity; card: CoachCardDisplay } {
  clearDemoCoachLocalStorage();

  const fromCardName = (() => {
    const name = coachProfile?.card_display?.pathwayName;
    if (typeof name !== 'string') return null;
    const match = Object.values(PATHWAY_BY_ID).find(
      (p) =>
        p.name === name ||
        p.name.includes(name) ||
        name.includes(p.name.replace(/^The /, '')),
    );
    return match?.id ?? null;
  })();

  const resolvedPathwayId =
    normalizePathwayId(coachProfile?.pathway_id) ?? fromCardName ?? 'engineering';

  const meta = PATHWAY_BY_ID[resolvedPathwayId];
  const firstName = profile?.first_name?.trim() || 'Coach';
  const lastName = profile?.last_name?.trim() || '';
  const fullName =
    [firstName, lastName].filter(Boolean).join(' ') ||
    profile?.email?.split('@')[0] ||
    'Coach';

  const identity: CoachIdentity = {
    firstName,
    lastName,
    fullName,
    email: profile?.email || '',
    pathwayId: resolvedPathwayId,
    pathwayName: meta?.name ?? 'Pathway',
    pathwayColor: PATHWAY_HEX[resolvedPathwayId] ?? '#f97316',
    gender: profile?.gender ?? undefined,
  };

  const cardFromDb = (coachProfile?.card_display ?? {}) as Partial<CoachCardDisplay>;
  const result: CoachResultData = {
    overall: assessment?.overall_rating ?? 0,
    tier: (assessment?.tier as CoachTier) ?? 'bronze',
    tierLabel: assessment?.tier_label ?? 'Bronze',
    strengths: assessment?.strengths?.length
      ? assessment.strengths
      : (cardFromDb.result?.strengths ?? []),
    opportunities: assessment?.opportunities?.length
      ? assessment.opportunities
      : (cardFromDb.result?.opportunities ?? []),
    reasoning: assessment?.reasoning ?? cardFromDb.result?.reasoning ?? '',
  };

  const card: CoachCardDisplay = {
    name: fullName,
    pathwayName: identity.pathwayName,
    role: coachProfile?.current_role || cardFromDb.role || 'Active coach',
    years: Number(coachProfile?.years_of_experience) || cardFromDb.years || 0,
    photo: coachProfile?.photo_url ?? cardFromDb.photo ?? localStorage.getItem('coach_profile_picture'),
    photoFrame: cardFromDb.photoFrame ?? loadPhotoFrame(),
    skillTags: cardFromDb.skillTags ?? result.strengths.slice(0, 3),
    outcomeCount: cardFromDb.outcomeCount ?? result.strengths.length,
    result,
  };

  try {
    localStorage.setItem('iso_coach_identity', JSON.stringify(identity));
    localStorage.setItem('iso_coach_card', JSON.stringify(card));
    localStorage.setItem('iso_coach_result', JSON.stringify(result));
    if (coachProfile?.photo_url) {
      localStorage.setItem('coach_profile_picture', coachProfile.photo_url);
    }
    if (typeof coachProfile?.completion_pct === 'number') {
      localStorage.setItem('coach_profile_completion', String(coachProfile.completion_pct));
    }
    if (
      assessment?.application_status === 'approved' ||
      profile?.coach_application_status === 'approved'
    ) {
      localStorage.removeItem('iso_coach_pending');
    }
  } catch {
    // Non-fatal
  }

  return { identity, card };
}

export function resolveCoachCard(): CoachCardDisplay | null {
  const stored = getCoachCardDisplay();
  if (stored) return stored;
  const identity = resolveCoachIdentity();
  const result = getCoachResult() ?? DEMO_COACH_RESULT;
  const photo = localStorage.getItem('coach_profile_picture');
  const photoFrame = loadPhotoFrame();
  return {
    name: identity.fullName,
    pathwayName: identity.pathwayName,
    role: 'Active coach',
    years: 12,
    photo,
    photoFrame,
    skillTags: result.strengths.slice(0, 3),
    outcomeCount: 3,
    result,
  };
}
