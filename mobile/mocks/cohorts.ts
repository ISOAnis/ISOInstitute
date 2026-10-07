import type { PathwayId } from '@/data/types';

/** Coaching opens in cohorts so every new coach gets a real onboarding. */
export const nextCohort = {
  name: 'Cohort 3',
  opensOn: '2026-11-02T09:00:00',
  spotsPerPathway: 6,
};

/** Spots already taken in the next cohort, per pathway. */
export const cohortTaken: Record<PathwayId, number> = {
  founder: 3,
  builder: 5,
  healer: 2,
  reformer: 4,
  warrior: 6,
  seeker: 1,
};

/** Where the demo applicant lands on the waitlist. */
export const waitlistPosition = 4;

/** The board's reason when an applicant isn't ready yet ("Your path in"). */
export const pathInReason = {
  category: 'More time in the pathway',
  note: 'The board wants to see you pull up to a few ISOs as a player first. Coaches who’ve been players run better ISOs.',
  playFirstIsos: 3,
  /** Play First counts ISOs attended after this date. */
  decidedAt: '2026-09-25T09:00:00',
};
