import { SvgXml } from 'react-native-svg';

import type { PathwayId } from '@/data';

/** Stroke icons lifted from the reference screens (24×24, stroke = currentColor). */
const paths = {
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  users:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.8 3 2.6 3.5 5.2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.2-6 8-6s7 2 8 6"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  forward: '<path d="M9 5l7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  dashboard: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  shield: '<path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z"/>',
  shieldCheck: '<path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z"/><path d="M9 12l2 2 4-4"/>',
  tee: '<path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5h.01"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  checkbox: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  area: '<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  idCard: '<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M8 17c.8-1.6 2.2-2.5 4-2.5s3.2.9 4 2.5"/>',
  camera: '<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
  book: '<path d="M4 5h11a3 3 0 0 1 3 3v12H7a3 3 0 0 1-3-3z"/><path d="M8 9h6M8 13h4"/>',
  star: '<path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.3l6-.8z"/>',
  share: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
  locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  sparkle: '<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z"/><path d="M19 15v5M16.5 17.5h5"/>',
  send: '<path d="M5 12h14M13 6l6 6-6 6"/>',

  // Pathway marks: rocket, cog, pulse line, globe, dumbbell, crescent moon.
  founder:
    '<path d="M12 2c3 2.5 4.5 6 4.5 10l-2 3h-5l-2-3c0-4 1.5-7.5 4.5-10z"/><circle cx="12" cy="9" r="1.6"/><path d="M9.5 15l-2.5 3 1 3 2.5-2M14.5 15l2.5 3-1 3-2.5-2"/>',
  builder:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  healer: '<path d="M2 12h4l2.5-6 4 12 3-8 1.5 2H22"/>',
  reformer: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  warrior:
    '<rect x="5" y="6" width="3.2" height="12" rx="1"/><rect x="15.8" y="6" width="3.2" height="12" rx="1"/><path d="M2.5 9.5v5M21.5 9.5v5M8.2 12h7.6"/>',
  seeker: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"/>',
} as const;

export type IconName = keyof typeof paths;

const STROKE: Partial<Record<IconName, number>> = { back: 2.2, forward: 2.2, check: 2.6, plus: 2.4, close: 2.2 };

export function Icon({ name, size = 24, color, strokeWidth }: { name: IconName; size?: number; color: string; strokeWidth?: number }) {
  const sw = strokeWidth ?? STROKE[name] ?? 2;
  const xml = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
  return <SvgXml xml={xml} width={size} height={size} />;
}

export const pathwayIcon = (id: PathwayId): IconName => id;
