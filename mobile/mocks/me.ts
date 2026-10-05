import type { Player } from '@/data/types';

export const me: Player = {
  id: 'me',
  name: '[Your name]',
  initials: 'YOU',
  phone: '',
  city: 'Denver',
  birthday: '',
  pathway: 'builder',
  pathwaySwitchesThisMonth: 1,
  coachStatus: 'none',
  rankProgress: { builder: 7 },
  coachesMet: 5,
  eventsAttended: 1,
  lateCancelsUsedThisMonth: 0,
  matchAnswers: [],
};

/** Coaches the player already follows. */
export const initialFollows = ['marcus'];

export const savedCard = { brand: 'Visa', last4: '4242' };
