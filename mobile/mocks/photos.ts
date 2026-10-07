import type { Photo } from '@/data/types';

/** Placeholder photos until real coach and venue uploads exist. Square face crops for avatars. */
export const coachPhotos: Record<string, Photo> = {
  marcus: require('./photos/coach-marcus-face.jpg'),
  sami: require('./photos/coach-sami-face.jpg'),
  dante: require('./photos/coach-dante-face.jpg'),
  nadia: require('./photos/coach-nadia-face.jpg'),
  jordan: require('./photos/coach-jordan-face.jpg'),
  rahim: require('./photos/coach-rahim-face.jpg'),
};

/** Head-and-shoulders cutouts with the background removed, for the coach card. */
export const coachCutouts: Record<string, Photo> = {
  marcus: require('./photos/coach-marcus-cut.png'),
  sami: require('./photos/coach-sami-cut.png'),
  dante: require('./photos/coach-dante-cut.png'),
  nadia: require('./photos/coach-nadia-cut.png'),
  jordan: require('./photos/coach-jordan-cut.png'),
  rahim: require('./photos/coach-rahim-cut.png'),
};

export const venuePhoto: Photo = require('./photos/venue-table.jpg');
