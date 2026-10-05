/**
 * Projection for the stylized Denver metro map (a 780×900 canvas, not a real
 * map). ISOs sit at their area's anchor plus a small jitter seeded by the ISO
 * id, so nothing about the exact venue leaks into the drawing.
 */
export const MAP_W = 780;
export const MAP_H = 900;

const anchors: Record<string, { x: number; y: number }> = {
  Westminster: { x: 170, y: 140 },
  'Downtown Denver': { x: 340, y: 300 },
  Lakewood: { x: 150, y: 450 },
  Glendale: { x: 430, y: 420 },
  'Southeast Aurora': { x: 610, y: 520 },
  Aurora: { x: 600, y: 380 },
  Englewood: { x: 330, y: 620 },
  Littleton: { x: 220, y: 790 },
  Centennial: { x: 510, y: 740 },
};

export const areaLabels = [
  { label: 'WESTMINSTER', x: 110, y: 70 },
  { label: 'DOWNTOWN', x: 290, y: 250 },
  { label: 'LAKEWOOD', x: 80, y: 380 },
  { label: 'AURORA', x: 560, y: 330 },
  { label: 'GLENDALE', x: 380, y: 470 },
  { label: 'ENGLEWOOD', x: 290, y: 610 },
  { label: 'LITTLETON', x: 180, y: 790 },
  { label: 'CENTENNIAL', x: 470, y: 740 },
];

function jitter(seed: string, salt: string): number {
  let h = 0;
  for (const c of seed + salt) h = (h * 31 + c.charCodeAt(0)) | 0;
  return ((Math.abs(h) % 1000) / 1000 - 0.5) * 70;
}

/** Center of an ISO's area circle on the canvas. */
export function mapPoint(isoId: string, areaName: string): { x: number; y: number } {
  const a = anchors[areaName] ?? { x: MAP_W / 2, y: MAP_H / 2 };
  return { x: a.x + jitter(isoId, 'x'), y: a.y + jitter(isoId, 'y') };
}
