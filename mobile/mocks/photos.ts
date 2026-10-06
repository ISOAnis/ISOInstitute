import type { Photo } from '@/data/types';

/** Placeholder photos until real coach and venue uploads exist. */
export const coachPhotos: Record<string, Photo> = {
  marcus: require('./photos/coach-marcus.jpg'),
  sami: require('./photos/coach-sami.jpg'),
  dante: require('./photos/coach-dante.jpg'),
  nadia: require('./photos/coach-nadia.jpg'),
  jordan: require('./photos/coach-jordan.jpg'),
  rahim: require('./photos/coach-rahim.jpg'),
};

export const venuePhoto: Photo = require('./photos/venue-table.jpg');
