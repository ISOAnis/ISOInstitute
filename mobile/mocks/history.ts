import type { LockerItem, PastIso } from '@/data/types';

export const pastIsos: PastIso[] = [
  {
    id: 'past-sa-sep28',
    title: 'Breaking into software',
    pathway: 'builder',
    coachInitials: 'SA',
    date: '2026-09-28T07:30:00',
    status: 'checked_in',
  },
  {
    id: 'past-rt-sep21',
    title: 'Shipping your first app',
    pathway: 'builder',
    coachInitials: 'RT',
    date: '2026-09-21T10:00:00',
    status: 'checked_in',
  },
  {
    id: 'past-mr-sep15',
    title: 'From side hustle to storefront',
    pathway: 'founder',
    coachInitials: 'MR',
    date: '2026-09-15T12:00:00',
    status: 'checked_in',
  },
];

export const locker: LockerItem[] = [
  { id: 'first-believers', name: 'First Believers Tee', status: 'owned', note: 'Season 1' },
  { id: 'iso-tee', name: 'ISO Tee', status: 'unlocked', note: 'Unlocked to buy' },
  { id: 'patch', name: 'Pathway Patch', status: 'locked', note: '15 ISOs' },
];
