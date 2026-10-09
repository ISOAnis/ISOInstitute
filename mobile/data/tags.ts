import type { PathwayId } from './types';

export type TagGroup = PathwayId | 'general';

/** Talking points coaches are open to and players want. Shared by both onboarding flows and used to rank Recommended ISOs. */
export const TAG_CATALOG: Record<TagGroup, string[]> = {
  general: [
    'Resume review',
    'Interview prep',
    'Career switch',
    'First job',
    'First internship',
    'Leaving a 9–5',
    'Side hustles',
    'Paying for school',
    'Scholarships',
    'Grad school',
  ],
  founder: ['Starting a business', 'Funding', 'Hiring', 'Pricing', 'Sales', 'Launching a product'],
  builder: ['Breaking into tech', 'Self-taught path', 'Engineering careers', 'Internships'],
  healer: ['Med school', 'Nursing', 'Nursing school', 'Burnout'],
  reformer: ['Law school', 'LSAT', 'Policy work'],
  warrior: ['Fitness careers', 'Training on a 9–5', 'Nutrition', 'Coaching careers', 'Discipline'],
  seeker: ['Purpose', 'Faith & career', 'Balance'],
};

export const MAX_TAGS = 5;

/** Every catalog tag, for telling catalog picks apart from custom ones. */
export const ALL_TAGS = new Set(Object.values(TAG_CATALOG).flat());
