import type { AdvisoryNote, CoachMonth, Regular } from '@/data/types';

/** The coach profile a newly approved demo account signs in as. */
export const DEMO_COACH_ID = 'marcus';

export const coachMonths: CoachMonth[] = [
  {
    coachId: 'marcus',
    overallDelta: 3,
    isosHosted: 6,
    playersMet: 15,
    showUpRate: 93,
    newFollowers: 12,
    nextTier: 'Platinum',
    nextTierAt: 90,
    nextTierNote: 'Host 3 more ISOs with 4.5+ feedback to reach Platinum and unlock the Platinum coach jacket.',
  },
];

export const advisoryNotes: AdvisoryNote[] = [
  {
    coachId: 'marcus',
    body: 'You’re invited to co-host the Founder Pitch Battle in December. Reply by Oct 20.',
    eventId: 'ev-pitch-battle',
  },
];

export const regulars: Regular[] = [
  { coachId: 'marcus', playerId: 'jalen', name: 'Jalen S.', initials: 'JS', pathway: 'founder', rank: 'JV', isosWithCoach: 3 },
  { coachId: 'marcus', playerId: 'amira', name: 'Amira K.', initials: 'AK', pathway: 'founder', rank: 'JV', isosWithCoach: 2 },
  { coachId: 'marcus', playerId: 'devin', name: 'Devin L.', initials: 'DL', pathway: 'founder', rank: 'Freshman', isosWithCoach: 0 },
];
