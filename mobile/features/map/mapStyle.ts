import { mapColors } from '@/theme';

/** Google Maps (Android) dark style. POIs and business labels are hidden so no venue name ever shows. */
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: mapColors.land }] },
  { elementType: 'labels.text.fill', stylers: [{ color: mapColors.label }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: mapColors.labelHalo }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: mapColors.road }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: mapColors.land }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: mapColors.water }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: mapColors.label }] },
];
