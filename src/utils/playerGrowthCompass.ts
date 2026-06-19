import { normalizePathwayId, type PathwayId } from '../data/pathways';

/** Stable metric keys — scores derive from portal activity; labels are pathway-specific. */
export type GrowthContributorId =
  | 'games'
  | 'buckets'
  | 'skills'
  | 'consistency'
  | 'coach'
  | 'community';

export interface GrowthAxisDef {
  radarLabel: string;
  label: string;
  tip: string;
}

export interface PlayerGrowthCompassProfile {
  pathwayId: PathwayId;
  axes: Record<GrowthContributorId, GrowthAxisDef>;
  source: 'default' | 'ai';
  generatedAt?: string;
}

const COMPASS_STORAGE_KEY = 'iso_player_growth_compass';

export const GROWTH_CONTRIBUTOR_IDS: GrowthContributorId[] = [
  'games',
  'buckets',
  'skills',
  'consistency',
  'coach',
  'community',
];

const PATHWAY_GROWTH_COMPASS: Record<PathwayId, Record<GrowthContributorId, GrowthAxisDef>> = {
  deen: {
    games: {
      radarLabel: 'Salah',
      label: 'Salah',
      tip: 'Guard your five daily prayers — consistency here anchors everything else on your path.',
    },
    buckets: {
      radarLabel: 'Quran',
      label: 'Quran',
      tip: 'Pages read, memorization, or tafsir each week. Close your Quran buckets in every game.',
    },
    skills: {
      radarLabel: 'Ilm',
      label: 'Islamic Knowledge',
      tip: 'Deepen fiqh, hadith, and tafsir as you unlock nodes on your Seeker skill tree.',
    },
    consistency: {
      radarLabel: 'Dhikr',
      label: 'Dhikr & Reflection',
      tip: 'Morning and evening adhkār, daily reflection — inner practice compounds over time.',
    },
    coach: {
      radarLabel: 'Tarbiyah',
      label: 'Tarbiyah',
      tip: 'Weekly check-ins with your ISO on deen goals, habits, and accountability.',
    },
    community: {
      radarLabel: 'Ummah',
      label: 'Ummah & Service',
      tip: 'Show up for halaqas, youth programs, and service in your local community.',
    },
  },
  health: {
    games: {
      radarLabel: 'Training',
      label: 'Training',
      tip: 'Hit your planned sessions — strength, cardio, or sport-specific work each week.',
    },
    buckets: {
      radarLabel: 'Nutrition',
      label: 'Nutrition',
      tip: 'Fuel, hydrate, and recover. Close out nutrition and wellness buckets in your games.',
    },
    skills: {
      radarLabel: 'Performance',
      label: 'Athletic Performance',
      tip: 'Speed, strength, and agility nodes unlock as you stack wins on the Warrior tree.',
    },
    consistency: {
      radarLabel: 'Recovery',
      label: 'Recovery',
      tip: 'Sleep, rest days, and mental reset — discipline off the field matters just as much.',
    },
    coach: {
      radarLabel: 'Coaching',
      label: 'ISO Coaching',
      tip: 'Sync with your ISO on programming, plateaus, and building mental toughness.',
    },
    community: {
      radarLabel: 'Squad',
      label: 'Training Squad',
      tip: 'Train with accountability partners and share wins in your pathway channel.',
    },
  },
  medicine: {
    games: {
      radarLabel: 'Academics',
      label: 'Academic Foundation',
      tip: 'GPA wins, prereqs, and study habits — each game moves your pre-med bar forward.',
    },
    buckets: {
      radarLabel: 'Clinical',
      label: 'Clinical Exposure',
      tip: 'Shadowing hours, hospital exposure, and patient-facing experiences close your buckets.',
    },
    skills: {
      radarLabel: 'Research',
      label: 'Research',
      tip: 'Lab skills, methodology, and independent projects on your Healer skill tree.',
    },
    consistency: {
      radarLabel: 'Compassion',
      label: 'Patient Compassion',
      tip: 'Bedside manner and empathy drills — show up consistently in how you serve others.',
    },
    coach: {
      radarLabel: 'Mentorship',
      label: 'Pre-Med Mentorship',
      tip: 'Check in with your ISO on MCAT strategy, applications, and your roadmap.',
    },
    community: {
      radarLabel: 'Service',
      label: 'Healthcare Service',
      tip: 'Volunteer hours, community health work, and giving back through your pathway.',
    },
  },
  engineering: {
    games: {
      radarLabel: 'Fundamentals',
      label: 'Core Fundamentals',
      tip: 'CS, math, and engineering basics — stack wins on the foundation first.',
    },
    buckets: {
      radarLabel: 'Projects',
      label: 'Shipped Projects',
      tip: 'Side projects, hackathon builds, and portfolio pieces close your buckets.',
    },
    skills: {
      radarLabel: 'Code Craft',
      label: 'Code Craft',
      tip: 'DSA, system design, and tooling unlock as you progress on the Builder tree.',
    },
    consistency: {
      radarLabel: 'Discipline',
      label: 'Daily Practice',
      tip: 'Daily coding beats cramming — consistent reps compound into real skill.',
    },
    coach: {
      radarLabel: 'Mentorship',
      label: 'Tech Mentorship',
      tip: 'Review code, career path, and internships with your ISO each week.',
    },
    community: {
      radarLabel: 'Collab',
      label: 'Collaboration',
      tip: 'Pair programming, open source, and team project wins in your pathway.',
    },
  },
  entrepreneurship: {
    games: {
      radarLabel: 'Validation',
      label: 'Idea Validation',
      tip: 'Test ideas, talk to users, and run experiments — win by learning fast.',
    },
    buckets: {
      radarLabel: 'Revenue',
      label: 'Traction & Revenue',
      tip: 'First sales, LOIs, and traction milestones close your Founder buckets.',
    },
    skills: {
      radarLabel: 'Product',
      label: 'Product Building',
      tip: 'MVP builds, UX, and go-to-market nodes on your skill tree.',
    },
    consistency: {
      radarLabel: 'Grit',
      label: 'Founder Grit',
      tip: 'Show up when motivation fades — the grind is where founders are made.',
    },
    coach: {
      radarLabel: 'Mentorship',
      label: 'Founder Mentorship',
      tip: 'Pitch feedback, strategy sessions, and accountability with your ISO.',
    },
    community: {
      radarLabel: 'Network',
      label: 'Founder Network',
      tip: 'Founder circles, warm intros, and community in your pathway channel.',
    },
  },
  global: {
    games: {
      radarLabel: 'Advocacy',
      label: 'Public Advocacy',
      tip: 'Speaking up, Model UN wins, and leadership moments that move people.',
    },
    buckets: {
      radarLabel: 'Policy',
      label: 'Policy & Writing',
      tip: 'Research papers, briefs, and written advocacy close your Reformer buckets.',
    },
    skills: {
      radarLabel: 'Leadership',
      label: 'Global Leadership',
      tip: 'Diplomacy, organizing, and systems thinking on your skill tree.',
    },
    consistency: {
      radarLabel: 'Discipline',
      label: 'Civic Discipline',
      tip: 'Daily reading, current events, and sustained engagement with global issues.',
    },
    coach: {
      radarLabel: 'Mentorship',
      label: 'Policy Mentorship',
      tip: 'Policy review, career path, and ISO guidance on building your platform.',
    },
    community: {
      radarLabel: 'Organizing',
      label: 'Community Organizing',
      tip: 'Grassroots work, coalitions, and local impact through your pathway.',
    },
  },
};

function defaultCompass(pathwayId: PathwayId): PlayerGrowthCompassProfile {
  return {
    pathwayId,
    axes: PATHWAY_GROWTH_COMPASS[pathwayId],
    source: 'default',
  };
}

/** Load AI-tailored compass from localStorage (future: populated by assessment / coach AI). */
export function getStoredGrowthCompass(pathwayId: PathwayId): PlayerGrowthCompassProfile | null {
  try {
    const raw = localStorage.getItem(COMPASS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerGrowthCompassProfile;
    if (parsed.pathwayId !== pathwayId || parsed.source !== 'ai') return null;
    if (!parsed.axes || GROWTH_CONTRIBUTOR_IDS.some(id => !parsed.axes[id]?.radarLabel)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist AI-generated compass axes for a player (called when AI personalization ships). */
export function saveGrowthCompass(profile: PlayerGrowthCompassProfile): void {
  try {
    localStorage.setItem(COMPASS_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore quota errors in demo */
  }
}

export function clearStoredGrowthCompass(): void {
  try {
    localStorage.removeItem(COMPASS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Resolve compass axes: AI override when present, otherwise pathway defaults. */
export function resolvePlayerGrowthCompass(pathwayId: string | null | undefined): PlayerGrowthCompassProfile {
  const normalized = normalizePathwayId(pathwayId) ?? 'deen';
  return getStoredGrowthCompass(normalized) ?? defaultCompass(normalized);
}

export function getGrowthAxis(
  compass: PlayerGrowthCompassProfile,
  contributorId: GrowthContributorId,
): GrowthAxisDef {
  return compass.axes[contributorId];
}

export function getCompassRadarLabels(compass: PlayerGrowthCompassProfile): string[] {
  return GROWTH_CONTRIBUTOR_IDS.map(id => compass.axes[id].radarLabel);
}
