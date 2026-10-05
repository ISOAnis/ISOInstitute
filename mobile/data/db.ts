/**
 * In-memory stand-in for the backend. The only module that imports mocks.
 * Replace the functions in ./api.ts with Supabase queries and delete this file.
 */
import * as mocks from '@/mocks';

import type { CoachApplication, HuddleMessage, Player, Seat } from './types';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export const db = {
  pathways: mocks.pathways,
  coaches: clone(mocks.coaches),
  coachPosts: mocks.coachPosts,
  coachFeedback: mocks.coachFeedback,
  coachMonths: mocks.coachMonths,
  advisoryNotes: mocks.advisoryNotes,
  regulars: mocks.regulars,
  venues: mocks.venues,
  events: mocks.events,
  ranks: mocks.ranks,
  recommendations: mocks.recommendations,
  quickReplies: mocks.quickReplies,
  savedCard: mocks.savedCard,
  pastIsos: mocks.pastIsos,
  locker: mocks.locker,
  isos: clone(mocks.isos),
  seats: clone(mocks.seats) as Seat[],
  huddle: clone(mocks.huddleMessages) as HuddleMessage[],
  me: clone(mocks.me) as Player,
  follows: new Set<string>(mocks.initialFollows),
  rsvps: new Set<string>(),
  applications: [] as CoachApplication[],
  communityPoolUsd: 0,
};

export const rules = {
  holdUsd: mocks.HOLD_AMOUNT_USD,
  freeLateCancelsPerMonth: mocks.FREE_LATE_CANCELS_PER_MONTH,
  maxPathwaySwitchesPerMonth: mocks.MAX_PATHWAY_SWITCHES_PER_MONTH,
  noShowAfterMin: mocks.NO_SHOW_AFTER_MIN,
};

export const DEMO_NOW = mocks.DEMO_NOW;
export const DEMO_COACH_ID = mocks.DEMO_COACH_ID;
