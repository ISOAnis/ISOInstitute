/** Location privacy: an area circle offset from the real venue (spec §4). */

const MILES_PER_DEG_LAT = 69;
export const AREA_RADIUS_MI = 5;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/**
 * Moves the venue roughly 1 mile in a direction derived from the ISO id, so the
 * circle is stable across renders but never centered on the real spot.
 */
export function offsetLocation(seed: string, lat: number, lng: number) {
  const angle = hash(seed) * Math.PI * 2;
  const miles = 0.7 + hash(`${seed}:d`) * 0.5;
  const dLat = (Math.sin(angle) * miles) / MILES_PER_DEG_LAT;
  const dLng = (Math.cos(angle) * miles) / (MILES_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180));
  return { lat: lat + dLat, lng: lng + dLng };
}

/** Deterministic 4-digit code that doesn't collide with `taken`. */
export function makeCheckinCode(seed: string, taken: Set<string>): string {
  for (let i = 0; ; i++) {
    const code = String(Math.floor(hash(`${seed}:${i}`) * 9000) + 1000);
    if (!taken.has(code)) return code;
  }
}
