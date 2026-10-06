import type { PathwayId } from '@/data/types';
import { colors } from './colors';
import { alpha, mix } from './colorUtils';

export interface PathwayPalette {
  /** Shapes, pins, bars, active pills. */
  fill: string;
  /** Readable pathway text on black. */
  text: string;
  /** Text on a solid `fill` background (pills, tags). */
  ink: string;
  /** Initials inside a map pin. */
  pinInk: string;
  /** Soft background tint (cards, area circles). */
  tint: string;
  /** Stronger tint for glows and selected rings. */
  glow: string;
  /** Border at roughly half strength. */
  line: string;
}

const base: Record<PathwayId, { fill: string; text: string; ink: string; pinInk: string }> = {
  founder: { fill: '#e65100', text: '#ff8a50', ink: colors.onGold, pinInk: '#FFFFFF' },
  builder: { fill: '#8e24aa', text: '#c77ddb', ink: '#FFFFFF', pinInk: '#FFFFFF' },
  healer: { fill: '#1e88e5', text: '#64b5f6', ink: colors.onGold, pinInk: '#FFFFFF' },
  reformer: { fill: '#00acc1', text: '#4dd0e1', ink: colors.onGold, pinInk: colors.onGold },
  warrior: { fill: '#e53935', text: '#ef7470', ink: colors.onGold, pinInk: '#FFFFFF' },
  seeker: { fill: '#1db954', text: '#4cd47b', ink: colors.onGold, pinInk: colors.onGold },
};

export const pathwayOrder: PathwayId[] = ['builder', 'founder', 'warrior', 'healer', 'seeker', 'reformer'];

export const pathwayColors: Record<PathwayId, PathwayPalette> = Object.fromEntries(
  Object.entries(base).map(([id, p]) => [id, { ...p, tint: alpha(p.fill, 0.14), glow: alpha(p.fill, 0.35), line: alpha(p.fill, 0.45) }]),
) as Record<PathwayId, PathwayPalette>;

/** Pathway tint for the coach card: 14% fading to 3% over surface1, plus the small full-strength accents. */
export function cardTint(id: PathwayId) {
  const { fill } = base[id];
  return {
    gradient: [mix(fill, colors.surface1, 0.14), mix(fill, colors.surface1, 0.07), mix(fill, colors.surface1, 0.03)] as const,
    topBar: fill,
    watermark: alpha(fill, 0.1),
    iconBg: alpha(fill, 0.14),
    photoFade: mix(fill, colors.surface1, 0.07),
  };
}
