import { router, useLocalSearchParams, type Href } from 'expo-router';

import type { CoachApplyStep } from '@/data';

const ROUTES = {
  basics: '/apply/basics',
  path: '/apply/path',
  experience: '/apply/experience',
  why: '/apply/why',
  topics: '/apply/topics',
  hosting: '/apply/hosting',
  guidelines: '/apply/guidelines',
  verify: '/apply/verify',
  extras: '/apply/extras',
  review: '/apply/review',
} as const satisfies Record<CoachApplyStep, string>;

/** Screen for each application step. `edit` sends Continue back to Review instead of on to the next step. */
export function applyStepHref(step: CoachApplyStep, opts?: { edit?: boolean }): Href {
  return opts?.edit ? { pathname: ROUTES[step], params: { edit: '1' } } : ROUTES[step];
}

/** What Continue does on a step: on to `next`, or back to Review when the coach came from there to edit. */
export function useApplyContinue(next: CoachApplyStep) {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  return () => (edit ? router.back() : router.push(applyStepHref(next)));
}
