import type { ItemCategory } from '../types/store';
import type { CoachTier } from '../utils/coachProfile';

const placeholder = (w: number, h: number, bg: string, text: string, fg = 'ffffff') =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(text)}`;

export interface CoachStoreItem {
  id: string;
  name: string;
  type: ItemCategory;
  imageUrl: string;
  price: number;
  tierRequirement: CoachTier;
  description?: string;
}

const TIER_ORDER: CoachTier[] = ['bronze', 'silver', 'gold', 'premium'];

export function coachTierMeetsRequirement(coachTier: CoachTier, required: CoachTier): boolean {
  return TIER_ORDER.indexOf(coachTier) >= TIER_ORDER.indexOf(required);
}

export const coachStoreItems: CoachStoreItem[] = [
  {
    id: 'coach-tee-bronze',
    name: 'ISO Coach Essentials Tee',
    type: 'shirt',
    imageUrl: placeholder(400, 400, '1a1a1a', 'Coach+Tee'),
    price: 32,
    tierRequirement: 'bronze',
    description: 'Basic coaching tee — your foundation on the sideline.',
  },
  {
    id: 'coach-cap-bronze',
    name: 'Sideline Coach Cap',
    type: 'hat',
    imageUrl: placeholder(400, 400, '0f172a', 'Coach+Cap'),
    price: 28,
    tierRequirement: 'bronze',
    description: 'Minimal ISO coach cap for events and sessions.',
  },
  {
    id: 'coach-polo-silver',
    name: 'Silver Coach Polo',
    type: 'shirt',
    imageUrl: placeholder(400, 400, '1e293b', 'Silver+Polo'),
    price: 48,
    tierRequirement: 'silver',
    description: 'Premium polo with embroidered coach badge.',
  },
  {
    id: 'coach-hoodie-silver',
    name: 'Locker Room Coach Hoodie',
    type: 'hoodie',
    imageUrl: placeholder(400, 400, '16213e', 'Coach+Hoodie'),
    price: 78,
    tierRequirement: 'silver',
    description: 'Heavyweight hoodie for pathway channels and coaching nights.',
  },
  {
    id: 'coach-joggers-silver',
    name: 'Performance Coach Joggers',
    type: 'joggers',
    imageUrl: placeholder(400, 400, '0d1117', 'Coach+Joggers'),
    price: 68,
    tierRequirement: 'silver',
    description: 'Athletic joggers with coach pathway accent stripe.',
  },
  {
    id: 'coach-jacket-gold',
    name: 'Gold Coach Warm-Up Jacket',
    type: 'athleisure',
    imageUrl: placeholder(400, 400, '1a1a2e', 'Gold+Jacket'),
    price: 110,
    tierRequirement: 'gold',
    description: 'Limited gold-tier coach jacket — earned through impact.',
  },
  {
    id: 'coach-vest-gold',
    name: 'Pathway Coach Vest',
    type: 'athleisure',
    imageUrl: placeholder(400, 400, '0f172a', 'Coach+Vest'),
    price: 95,
    tierRequirement: 'gold',
    description: 'Layered vest with pathway colorway customization.',
  },
  {
    id: 'coach-set-premium',
    name: 'Premium Coach Collection Set',
    type: 'hoodie',
    imageUrl: placeholder(400, 400, '2d1b4e', 'Premium+Set'),
    price: 185,
    tierRequirement: 'premium',
    description: 'Signature premium collection — elite coaches only.',
  },
  {
    id: 'coach-bag-premium',
    name: 'Elite Coach Duffel',
    type: 'accessory',
    imageUrl: placeholder(400, 400, '1e1b4b', 'Coach+Duffel'),
    price: 120,
    tierRequirement: 'premium',
    description: 'Premium duffel with ISO coach insignia.',
  },
];

export const COACH_TIER_LABELS: Record<CoachTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  premium: 'Premium',
};
