import type { Ref } from 'react';

import type { IsoSummary, Venue } from '@/data';

export type LatLng = { latitude: number; longitude: number };
export type Region = LatLng & { latitudeDelta: number; longitudeDelta: number };
export type Insets = { top: number; bottom: number; left: number; right: number };

export interface MapCanvasHandle {
  animateToRegion: (region: Region, duration?: number) => void;
  fitTo: (points: LatLng[], padding: Insets) => void;
}

export interface MapCanvasProps {
  ref?: Ref<MapCanvasHandle>;
  /** Only the fuzzed display coordinates are ever read from these. */
  isos?: IsoSummary[];
  /** ISOs outside this set fade to 20%. Omit to show every dot at full strength. */
  visibleIds?: Set<string>;
  selectedId?: string;
  onSelectIso?: (id: string) => void;
  /** Partner spots at their exact location. Coach map only. */
  venues?: Venue[];
  selectedVenueId?: string;
  onSelectVenue?: (id: string) => void;
  onPressMap?: () => void;
  showsUserLocation?: boolean;
  /** False for small embedded previews: no pan, zoom or rotate. */
  interactive?: boolean;
  initialRegion?: Region;
  /** Keeps the map's legal label, compass and cluster zooms clear of floating chrome. */
  padding?: Insets;
}
