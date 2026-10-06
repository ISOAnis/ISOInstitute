/**
 * Core palette. Depth comes from lighter surfaces, not outlines:
 * bg → surface1 (cards, sheets, tab bar) → surface2 (cards on cards, inputs, pills) → surface3 (pressed / selected).
 * Gold is reserved for the one primary button per screen, the wordmark, Overall numbers and the active tab.
 */
export const colors = {
  bg: '#141416',
  surface1: '#1C1C20',
  surface2: '#242429',
  surface3: '#2E2E34',

  /** The only border: where two same-color surfaces touch, and list dividers. */
  hairline: 'rgba(255,255,255,0.06)',

  /** 4.5:1+ on every surface. */
  text: '#F2F2F2',
  /** Anything people need to read that isn't primary. Never go darker. */
  textSecondary: '#B4B4B8',
  /** Timestamps only. */
  textMeta: '#8A8A90',
  /** Disabled controls (exempt from contrast rules). */
  textDisabled: '#6A6A70',

  gold: '#C8873A',
  goldPressed: '#E0A35A',
  onGold: '#141416',

  backdrop: 'rgba(0,0,0,0.6)',
  overlay: 'rgba(20,20,22,0.88)',
  /** Floating controls over the map (header, tab bar, recenter). */
  glass: 'rgba(20,20,22,0.85)',
  /** The same charcoal, lighter, layered on an iOS blur. */
  glassOverBlur: 'rgba(20,20,22,0.55)',
  scrim: 'rgba(0,0,0,0.45)',
  shadow: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;

/** Real map styling (Android / Google Maps). iOS uses Apple's dark style. */
/** Brushed-silver stops for the ISO wordmark, matched to the logo mark. */
export const metal = ['#FFFFFF', '#C9CACF', '#8E8F96', '#E6E7EA', '#7A7B82'] as const;

export const mapColors = {
  land: '#1a1a1d',
  water: '#0f1012',
  road: '#2a2a2f',
  label: '#8a8a90',
  labelHalo: '#141416',
  cluster: '#2E2E34',
} as const;

/** Status colors used in rules copy (green = released, red = captured). */
export const statusColors = {
  good: '#5ad888',
  goodTint: 'rgba(90,216,136,0.12)',
  bad: '#f08a86',
  badTint: 'rgba(240,138,134,0.12)',
} as const;

/** Soft top shadow for the tab bar and bottom sheets. */
export const raisedShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.35,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: -4 },
  elevation: 12,
} as const;
