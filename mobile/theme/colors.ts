/** Core palette from docs 2/ISO_BUILD_SPEC.md §2. Gold = brand + main actions. */
export const colors = {
  bg: '#080808',
  bgRaised: '#0b0b0b',
  mapBg: '#0e0f11',

  surface: '#121212',
  surfaceAlt: '#141414',
  surfaceHigh: '#161616',
  surfaceInset: '#1a1a1a',
  surfaceInput: '#1c1c1c',
  surfaceBox: '#1f1f1f',
  avatar: '#2a2a2a',

  border: '#222222',
  borderAlt: '#262626',
  borderStrong: '#333333',
  borderSoft: '#1f1f1f',
  borderChip: '#2a2a2a',
  borderBox: '#3a3a3a',
  borderButton: '#444444',

  text: '#FFFFFF',
  textBody: '#E0E0E0',
  textMuted: '#AAAAAA',
  textDim: '#8f8f8f',
  textDisabled: '#555555',

  gold: '#C8873A',
  goldPressed: '#E0A35A',
  onGold: '#080808',

  borderChipAlt: '#2e2e2e',

  backdrop: 'rgba(0,0,0,0.7)',
  overlay: 'rgba(8,8,8,0.85)',
  scrim: 'rgba(0,0,0,0.55)',
  inset: 'rgba(0,0,0,0.3)',
  sheen: 'rgba(255,255,255,0.02)',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;

/** Stylized Denver metro map art. */
export const mapColors = {
  ground: '#0f1012',
  frame: '#0e0f11',
  parkA: '#141518',
  parkB: '#121316',
  green: '#111a14',
  roadMajor: '#1c1e22',
  roadMinor: '#1a1c20',
  roadDiagA: '#1b1d21',
  roadDiagB: '#18191c',
  label: '#3d3f44',
} as const;

/** Status colors used in rules copy (green = released, red = captured). */
export const statusColors = {
  good: '#4cd47b',
  goodTint: 'rgba(76,212,123,0.1)',
  goodLine: 'rgba(76,212,123,0.35)',
  bad: '#ef7470',
  badTint: 'rgba(239,116,112,0.1)',
  badLine: 'rgba(239,116,112,0.35)',
  goldTint: 'rgba(200,135,58,0.12)',
  goldLine: 'rgba(200,135,58,0.45)',
  goldDeep: '#1a140c',
} as const;
