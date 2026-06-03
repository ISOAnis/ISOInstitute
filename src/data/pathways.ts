export type PathwayId =
  | 'deen'
  | 'health'
  | 'medicine'
  | 'engineering'
  | 'entrepreneurship'
  | 'global';

export interface PathwayMeta {
  id: PathwayId;
  name: string;
  legacyName: string;
  description: string;
  tagline: string;
  color: string;
}

export const PATHWAYS: PathwayMeta[] = [
  {
    id: 'deen',
    name: 'The Seeker Pathway',
    legacyName: 'Deen and Purpose',
    description:
      'Spiritual development, Islamic knowledge, reflection, and balance between dunya and akhirah. This is the core of all growth — everything flows from this center.',
    tagline: '"Center your faith before your function."',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'health',
    name: 'The Warrior Pathway',
    legacyName: 'Health and Wellness',
    description:
      'Discipline through the body — physical wellness, gym consistency, mental health, nutrition, and self-discipline.',
    tagline: '"Train your body. Strengthen your mind."',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'medicine',
    name: 'The Healer Pathway',
    legacyName: 'Medicine and healthcare',
    description:
      'Serving through healing — for those exploring pre-med, nursing, public health, or medical professions.',
    tagline: '"Serve through science and compassion."',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'engineering',
    name: 'The Builder Pathway',
    legacyName: 'Engineering and Tech',
    description:
      'Building and solving — for innovators in STEM and design who want to leave a real-world impact.',
    tagline: '"Design, build, and solve for tomorrow."',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'entrepreneurship',
    name: 'The Founder Pathway',
    legacyName: 'Entrepreneurship and business',
    description:
      'For builders, dreamers, and leaders turning ideas into reality — from startups to social ventures.',
    tagline: '"Build something that outlasts you."',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'global',
    name: 'The Reformer Pathway',
    legacyName: 'Global Affairs, Law, and Policy',
    description:
      'For those navigating global impact — economics, diplomacy, international organizations, and ethical leadership.',
    tagline: '"Lead globally. Move with purpose."',
    color: 'from-cyan-500 to-blue-600',
  },
];

export const PATHWAY_BY_ID = Object.fromEntries(
  PATHWAYS.map((pathway) => [pathway.id, pathway]),
) as Record<PathwayId, PathwayMeta>;

export const PATHWAYS_MARKETING_LIST =
  'The Seeker, The Warrior, The Healer, The Builder, The Founder, and The Reformer';

export const PATHWAYS_MARKETING_WITH_LEGACY = PATHWAYS.map(
  (pathway) => `${pathway.name} (${pathway.legacyName})`,
).join(', ');

export function getPathwayName(id: string): string {
  return PATHWAY_BY_ID[id as PathwayId]?.name ?? id;
}

export function getPathwayLegacyName(id: string): string {
  return PATHWAY_BY_ID[id as PathwayId]?.legacyName ?? id;
}
