import { AREA_RADIUS_MI, type IsoSummary } from '@/data';

import type { LatLng, Region } from './types';

const MI_PER_DEG_LAT = 69;

/** The whole Denver metro, Westminster to Centennial. */
export const DENVER_METRO: Region = { latitude: 39.7392, longitude: -104.9903, latitudeDelta: 0.6, longitudeDelta: 0.5 };

/** Past this, a fuzzed dot starts to narrow down to a block. */
export const MAX_ZOOM = 13;

export const AREA_RADIUS_M = AREA_RADIUS_MI * 1609.34;

/** The fuzzed display point. Venue coordinates never reach the map. */
export const displayPoint = (iso: Pick<IsoSummary, 'displayLat' | 'displayLng'>): LatLng => ({
  latitude: iso.displayLat,
  longitude: iso.displayLng,
});

export const regionAround = (p: LatLng, latitudeDelta: number, aspect: number): Region => ({
  ...p,
  latitudeDelta,
  longitudeDelta: (latitudeDelta * aspect) / Math.cos((p.latitude * Math.PI) / 180),
});

/**
 * A region that frames an ISO's whole area circle and places it in the middle
 * of the visible band (between the floating header and the sheet), not the
 * middle of the screen. `camera` is padding the native map already applies to
 * its own center (Google Maps does; Apple Maps doesn't).
 */
export function focusRegion(
  point: LatLng,
  screen: { width: number; height: number },
  visible: { top: number; bottom: number },
  camera: { top: number; bottom: number } = { top: 0, bottom: 0 },
): Region {
  const band = Math.max(160, screen.height - visible.top - visible.bottom);
  const viewH = screen.height - camera.top - camera.bottom;
  const span = ((AREA_RADIUS_MI * 2) / MI_PER_DEG_LAT) * 1.3;
  const latitudeDelta = Math.min(1.2, (span * viewH) / band);
  const targetY = visible.top + band / 2 - camera.top;
  const latitude = point.latitude + ((targetY - viewH / 2) * latitudeDelta) / viewH;
  return regionAround({ latitude, longitude: point.longitude }, latitudeDelta, screen.width / viewH);
}
