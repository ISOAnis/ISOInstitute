import {
  User,
  StoreItem,
  LevelTier,
  UserLevel,
  EarnedReward,
} from '../types/store';

// Placeholder images using a consistent pattern
const PLACEHOLDER_BASE = 'https://placehold.co';

/**
 * Generate placeholder image URL
 */
function placeholder(width: number, height: number, bg: string, text: string, textColor: string = 'white'): string {
  return `${PLACEHOLDER_BASE}/${width}x${height}/${bg}/${textColor}?text=${encodeURIComponent(text)}`;
}

/**
 * Mock user with Locker Room Pass and Varsity level
 */
export const mockUser: User = {
  id: 'user-001',
  name: 'Marcus Johnson',
  email: 'marcus.j@email.com',
  hasLockerRoomPass: true,
  currentLevel: 'Varsity',
  xp: 3860,
  xpToNextLevel: 6000, // D1 threshold
  monthlyPurchaseCount: 2,
  monthlyPurchaseLimit: 4,
  unlockedLevels: ['Freshman', 'JV', 'Varsity'],
  earnedRewards: [
    {
      id: 'reward-1',
      levelUnlocked: 'Freshman',
      itemId: 'fresh-hoodie-1',
      itemType: 'clothing',
      claimedAt: new Date('2024-10-15'),
      itemName: 'Freshman Welcome Hoodie',
    },
    {
      id: 'reward-2',
      levelUnlocked: 'Freshman',
      itemId: 'fresh-acc-1',
      itemType: 'accessory',
      claimedAt: new Date('2024-10-15'),
      itemName: 'ISO Lanyard',
    },
    {
      id: 'reward-3',
      levelUnlocked: 'JV',
      itemId: 'jv-shirt-1',
      itemType: 'clothing',
      claimedAt: new Date('2024-11-20'),
      itemName: 'JV Training Tee',
    },
    {
      id: 'reward-4',
      levelUnlocked: 'JV',
      itemId: 'jv-acc-1',
      itemType: 'accessory',
      claimedAt: new Date('2024-11-20'),
      itemName: 'JV Wristband Set',
    },
    // Varsity rewards not yet claimed
    {
      id: 'reward-5',
      levelUnlocked: 'Varsity',
      itemId: null,
      itemType: 'clothing',
      claimedAt: null,
    },
    {
      id: 'reward-6',
      levelUnlocked: 'Varsity',
      itemId: null,
      itemType: 'accessory',
      claimedAt: null,
    },
  ],
  avatarUrl: placeholder(200, 200, '1e293b', 'MJ', 'f97316'),
};

/**
 * Mock user without Locker Room Pass (for testing gating)
 */
export const mockUserNoPass: User = {
  id: 'user-002',
  name: 'Sarah Chen',
  email: 'sarah.c@email.com',
  hasLockerRoomPass: false,
  currentLevel: 'Freshman',
  xp: 0,
  xpToNextLevel: 1000,
  monthlyPurchaseCount: 0,
  monthlyPurchaseLimit: 4,
  unlockedLevels: [],
  earnedRewards: [],
  avatarUrl: placeholder(200, 200, '1e293b', 'SC', 'f97316'),
};

/**
 * ISO General Store items (lifestyle collection)
 */
export const generalStoreItems: StoreItem[] = [
  // Shirts
  {
    id: 'gen-shirt-1',
    name: 'ISO Classic Tee',
    type: 'shirt',
    imageUrl: placeholder(400, 400, '0f172a', 'Classic+Tee'),
    price: 35,
    isFreeEligible: false,
    description: 'Premium cotton tee with embroidered ISO logo',
    colors: ['Black', 'White', 'Navy'],
  },
  {
    id: 'gen-shirt-2',
    name: 'Faith & Grind Tee',
    type: 'shirt',
    imageUrl: placeholder(400, 400, '1e3a5f', 'Faith+Grind'),
    price: 38,
    isFreeEligible: false,
    description: 'Motivational graphic tee for the faithful hustler',
    colors: ['Charcoal', 'Sand'],
  },
  {
    id: 'gen-shirt-3',
    name: 'Court Vision Long Sleeve',
    type: 'shirt',
    imageUrl: placeholder(400, 400, '0d1117', 'Long+Sleeve'),
    price: 45,
    isFreeEligible: false,
    description: 'Lightweight long sleeve for training days',
    colors: ['Black', 'Grey'],
  },
  // Joggers
  {
    id: 'gen-joggers-1',
    name: 'ISO Comfort Joggers',
    type: 'joggers',
    imageUrl: placeholder(400, 400, '1a1a2e', 'Joggers'),
    price: 65,
    isFreeEligible: false,
    description: 'Premium fleece joggers with zip pockets',
    colors: ['Black', 'Grey', 'Navy'],
  },
  {
    id: 'gen-joggers-2',
    name: 'Performance Track Pants',
    type: 'joggers',
    imageUrl: placeholder(400, 400, '16213e', 'Track+Pants'),
    price: 70,
    isFreeEligible: false,
    description: 'Moisture-wicking track pants for game day',
    colors: ['Black', 'Orange'],
  },
  // Hats
  {
    id: 'gen-hat-1',
    name: 'ISO Snapback',
    type: 'hat',
    imageUrl: placeholder(400, 400, '0f172a', 'Snapback'),
    price: 32,
    isFreeEligible: false,
    description: 'Classic snapback with raised embroidery',
    colors: ['Black/Orange', 'Navy/White'],
  },
  {
    id: 'gen-hat-2',
    name: 'Dad Cap - Minimal',
    type: 'hat',
    imageUrl: placeholder(400, 400, '1e293b', 'Dad+Cap'),
    price: 28,
    isFreeEligible: false,
    description: 'Relaxed fit dad cap with subtle logo',
    colors: ['Stone', 'Black', 'Navy'],
  },
  // Hoodies
  {
    id: 'gen-hoodie-1',
    name: 'ISO Essential Hoodie',
    type: 'hoodie',
    imageUrl: placeholder(400, 400, '0f172a', 'Hoodie'),
    price: 75,
    isFreeEligible: false,
    description: 'Heavyweight cotton hoodie with kangaroo pocket',
    colors: ['Black', 'Grey', 'Navy'],
  },
  {
    id: 'gen-hoodie-2',
    name: 'Locker Room Zip-Up',
    type: 'hoodie',
    imageUrl: placeholder(400, 400, '1a1a2e', 'Zip+Hoodie'),
    price: 85,
    isFreeEligible: false,
    description: 'Full-zip hoodie with tech fleece lining',
    colors: ['Black', 'Charcoal'],
  },
  // Athleisure
  {
    id: 'gen-ath-1',
    name: 'ISO Training Shorts',
    type: 'athleisure',
    imageUrl: placeholder(400, 400, '16213e', 'Shorts'),
    price: 45,
    isFreeEligible: false,
    description: 'Breathable training shorts with liner',
    colors: ['Black', 'Navy', 'Grey'],
  },
  {
    id: 'gen-ath-2',
    name: 'Warm-Up Jacket',
    type: 'athleisure',
    imageUrl: placeholder(400, 400, '0d1117', 'Jacket'),
    price: 95,
    isFreeEligible: false,
    description: 'Lightweight warm-up jacket with ISO branding',
    colors: ['Black/Orange', 'Navy/White'],
  },
  // Accessories
  {
    id: 'gen-acc-1',
    name: 'ISO Gym Bag',
    type: 'accessory',
    imageUrl: placeholder(400, 400, '1e293b', 'Gym+Bag'),
    price: 55,
    isFreeEligible: false,
    description: 'Durable gym duffel with shoe compartment',
    colors: ['Black', 'Grey'],
  },
  {
    id: 'gen-acc-2',
    name: 'Wristband Set (3-Pack)',
    type: 'accessory',
    imageUrl: placeholder(400, 400, '0f172a', 'Wristbands'),
    price: 15,
    isFreeEligible: false,
    description: 'Performance wristbands with ISO logo',
    colors: ['Black/Orange/White'],
  },
  {
    id: 'gen-acc-3',
    name: 'ISO Water Bottle',
    type: 'accessory',
    imageUrl: placeholder(400, 400, '16213e', 'Bottle'),
    price: 25,
    isFreeEligible: false,
    description: '32oz insulated stainless steel bottle',
    colors: ['Black', 'Orange'],
  },
];

/**
 * Level Store items by tier
 */
export const levelStoreItems: Record<UserLevel, StoreItem[]> = {
  Freshman: [
    // Clothing
    {
      id: 'fresh-hoodie-1',
      name: 'Freshman Welcome Hoodie',
      type: 'hoodie',
      imageUrl: placeholder(400, 400, '166534', 'FR+Hoodie'),
      price: 60,
      isFreeEligible: true,
      levelRequirement: 'Freshman',
      description: 'Your first step into the ISO family',
    },
    {
      id: 'fresh-shirt-1',
      name: 'Freshman Class Tee',
      type: 'shirt',
      imageUrl: placeholder(400, 400, '15803d', 'FR+Tee'),
      price: 30,
      isFreeEligible: true,
      levelRequirement: 'Freshman',
      description: 'Rep your rookie status with pride',
    },
    {
      id: 'fresh-joggers-1',
      name: 'Freshman Sweats',
      type: 'joggers',
      imageUrl: placeholder(400, 400, '14532d', 'FR+Sweats'),
      price: 50,
      isFreeEligible: true,
      levelRequirement: 'Freshman',
      description: 'Comfort for the journey ahead',
    },
    // Accessories
    {
      id: 'fresh-acc-1',
      name: 'ISO Lanyard',
      type: 'accessory',
      imageUrl: placeholder(400, 400, '166534', 'Lanyard'),
      price: 12,
      isFreeEligible: true,
      levelRequirement: 'Freshman',
      description: 'Keep your keys close and faith closer',
    },
    {
      id: 'fresh-acc-2',
      name: 'Freshman Sticker Pack',
      type: 'accessory',
      imageUrl: placeholder(400, 400, '15803d', 'Stickers'),
      price: 8,
      isFreeEligible: true,
      levelRequirement: 'Freshman',
      description: 'Deck out your gear with ISO vibes',
    },
    {
      id: 'fresh-hat-1',
      name: 'Freshman Cap',
      type: 'hat',
      imageUrl: placeholder(400, 400, '14532d', 'FR+Cap'),
      price: 25,
      isFreeEligible: false,
      levelRequirement: 'Freshman',
      description: 'Classic cap for the new recruit',
    },
  ],
  JV: [
    // Clothing
    {
      id: 'jv-shirt-1',
      name: 'JV Training Tee',
      type: 'shirt',
      imageUrl: placeholder(400, 400, '1e40af', 'JV+Tee'),
      price: 38,
      isFreeEligible: true,
      levelRequirement: 'JV',
      description: 'Performance tee for rising players',
    },
    {
      id: 'jv-hoodie-1',
      name: 'JV Squad Hoodie',
      type: 'hoodie',
      imageUrl: placeholder(400, 400, '1d4ed8', 'JV+Hoodie'),
      price: 70,
      isFreeEligible: true,
      levelRequirement: 'JV',
      description: 'Level up your layering game',
    },
    {
      id: 'jv-joggers-1',
      name: 'JV Track Pants',
      type: 'joggers',
      imageUrl: placeholder(400, 400, '2563eb', 'JV+Track'),
      price: 60,
      isFreeEligible: true,
      levelRequirement: 'JV',
      description: 'Built for those putting in work',
    },
    // Accessories
    {
      id: 'jv-acc-1',
      name: 'JV Wristband Set',
      type: 'accessory',
      imageUrl: placeholder(400, 400, '1e40af', 'JV+Bands'),
      price: 18,
      isFreeEligible: true,
      levelRequirement: 'JV',
      description: 'Performance wristbands, JV edition',
    },
    {
      id: 'jv-acc-2',
      name: 'JV Headband',
      type: 'accessory',
      imageUrl: placeholder(400, 400, '1d4ed8', 'Headband'),
      price: 15,
      isFreeEligible: true,
      levelRequirement: 'JV',
      description: 'Keep your focus sharp',
    },
    {
      id: 'jv-hat-1',
      name: 'JV Snapback',
      type: 'hat',
      imageUrl: placeholder(400, 400, '2563eb', 'JV+Snap'),
      price: 35,
      isFreeEligible: false,
      levelRequirement: 'JV',
      description: 'Snapback for the dedicated',
    },
  ],
  Varsity: [
    // Clothing
    {
      id: 'varsity-hoodie-1',
      name: 'Varsity Elite Hoodie',
      type: 'hoodie',
      imageUrl: placeholder(400, 400, '7c2d12', 'V+Hoodie'),
      price: 85,
      isFreeEligible: true,
      levelRequirement: 'Varsity',
      description: 'Premium hoodie for the committed',
    },
    {
      id: 'varsity-jacket-1',
      name: 'Varsity Letter Jacket',
      type: 'athleisure',
      imageUrl: placeholder(400, 400, '9a3412', 'V+Jacket'),
      price: 120,
      isFreeEligible: true,
      levelRequirement: 'Varsity',
      description: 'Iconic jacket earned through dedication',
    },
    {
      id: 'varsity-shirt-1',
      name: 'Varsity Performance Tee',
      type: 'shirt',
      imageUrl: placeholder(400, 400, 'b45309', 'V+Tee'),
      price: 45,
      isFreeEligible: true,
      levelRequirement: 'Varsity',
      description: 'Tech fabric for peak performance',
    },
    {
      id: 'varsity-joggers-1',
      name: 'Varsity Elite Joggers',
      type: 'joggers',
      imageUrl: placeholder(400, 400, '7c2d12', 'V+Joggers'),
      price: 75,
      isFreeEligible: true,
      levelRequirement: 'Varsity',
      description: 'Premium joggers with varsity details',
    },
    // Accessories
    {
      id: 'varsity-acc-1',
      name: 'Varsity Duffle Bag',
      type: 'accessory',
      imageUrl: placeholder(400, 400, '9a3412', 'V+Bag'),
      price: 80,
      isFreeEligible: true,
      levelRequirement: 'Varsity',
      description: 'Premium bag for game day',
    },
    {
      id: 'varsity-acc-2',
      name: 'Varsity Patch Set',
      type: 'accessory',
      imageUrl: placeholder(400, 400, 'b45309', 'Patches'),
      price: 25,
      isFreeEligible: true,
      levelRequirement: 'Varsity',
      description: 'Iron-on patches to rep your status',
    },
    {
      id: 'varsity-hat-1',
      name: 'Varsity Fitted Cap',
      type: 'hat',
      imageUrl: placeholder(400, 400, '7c2d12', 'V+Cap'),
      price: 40,
      isFreeEligible: false,
      levelRequirement: 'Varsity',
      description: 'Premium fitted for the elite',
    },
  ],
  D1: [
    // Clothing
    {
      id: 'd1-jacket-1',
      name: 'D1 Championship Jacket',
      type: 'athleisure',
      imageUrl: placeholder(400, 400, '6b21a8', 'D1+Jacket'),
      price: 175,
      isFreeEligible: true,
      levelRequirement: 'D1',
      description: 'The pinnacle of ISO achievement',
    },
    {
      id: 'd1-hoodie-1',
      name: 'D1 Premium Hoodie',
      type: 'hoodie',
      imageUrl: placeholder(400, 400, '7c3aed', 'D1+Hoodie'),
      price: 110,
      isFreeEligible: true,
      levelRequirement: 'D1',
      description: 'Luxury hoodie for the elite',
    },
    {
      id: 'd1-shirt-1',
      name: 'D1 Tech Tee',
      type: 'shirt',
      imageUrl: placeholder(400, 400, '8b5cf6', 'D1+Tee'),
      price: 55,
      isFreeEligible: true,
      levelRequirement: 'D1',
      description: 'Premium performance fabric',
    },
    {
      id: 'd1-joggers-1',
      name: 'D1 Elite Sweats',
      type: 'joggers',
      imageUrl: placeholder(400, 400, '6b21a8', 'D1+Sweats'),
      price: 95,
      isFreeEligible: true,
      levelRequirement: 'D1',
      description: 'The finest joggers in the game',
    },
    // Accessories
    {
      id: 'd1-acc-1',
      name: 'D1 Championship Ring',
      type: 'accessory',
      imageUrl: placeholder(400, 400, '7c3aed', 'D1+Ring'),
      price: 150,
      isFreeEligible: true,
      levelRequirement: 'D1',
      description: 'Symbol of ultimate achievement',
    },
    {
      id: 'd1-acc-2',
      name: 'D1 Backpack',
      type: 'accessory',
      imageUrl: placeholder(400, 400, '8b5cf6', 'D1+Pack'),
      price: 120,
      isFreeEligible: true,
      levelRequirement: 'D1',
      description: 'Premium backpack for champions',
    },
    {
      id: 'd1-hat-1',
      name: 'D1 Limited Snapback',
      type: 'hat',
      imageUrl: placeholder(400, 400, '6b21a8', 'D1+Snap'),
      price: 50,
      isFreeEligible: false,
      levelRequirement: 'D1',
      description: 'Limited edition D1 cap',
    },
  ],
};

/**
 * Level tier information for UI display
 */
export const levelTiers: LevelTier[] = [
  {
    level: 'Freshman',
    title: 'Freshman',
    description: 'Start your journey with the ISO family. Build your foundation and earn your first gear.',
    tagline: 'Every champion was once a beginner.',
    xpRequired: 0,
    previewImages: [
      placeholder(200, 200, '166534', 'FR+1'),
      placeholder(200, 200, '15803d', 'FR+2'),
    ],
    benefits: [
      'Access to Freshman-exclusive collection',
      '1 free clothing item',
      '1 free accessory',
      'Welcome to the ISO community',
    ],
  },
  {
    level: 'JV',
    title: 'JV',
    description: 'You\'re putting in the work. Level up your wardrobe to match your dedication.',
    tagline: 'Consistency builds champions.',
    xpRequired: 1000,
    previewImages: [
      placeholder(200, 200, '1e40af', 'JV+1'),
      placeholder(200, 200, '1d4ed8', 'JV+2'),
    ],
    benefits: [
      'Access to JV-exclusive collection',
      '1 free clothing item',
      '1 free accessory',
      'JV community events',
    ],
  },
  {
    level: 'Varsity',
    title: 'Varsity',
    description: 'You\'ve proven your commitment. Access premium gear built for game days.',
    tagline: 'Built for game days.',
    xpRequired: 3000,
    previewImages: [
      placeholder(200, 200, '7c2d12', 'V+1'),
      placeholder(200, 200, '9a3412', 'V+2'),
    ],
    benefits: [
      'Access to Varsity-exclusive collection',
      '1 free clothing item',
      '1 free accessory',
      'Varsity member badge',
      'Priority event access',
    ],
  },
  {
    level: 'D1',
    title: 'D1',
    description: 'The pinnacle of ISO achievement. Elite gear for those who\'ve reached the top.',
    tagline: 'Elite status. Elite gear.',
    xpRequired: 6000,
    previewImages: [
      placeholder(200, 200, '6b21a8', 'D1+1'),
      placeholder(200, 200, '7c3aed', 'D1+2'),
    ],
    benefits: [
      'Access to D1-exclusive collection',
      '1 free clothing item',
      '1 free accessory',
      'D1 championship ring eligible',
      'VIP event access',
      'Exclusive D1 community',
    ],
  },
];

/**
 * Get color scheme for a level
 */
export const levelColors: Record<UserLevel, { primary: string; secondary: string; bg: string }> = {
  Freshman: {
    primary: 'text-green-400',
    secondary: 'text-green-500',
    bg: 'bg-green-500/20',
  },
  JV: {
    primary: 'text-blue-400',
    secondary: 'text-blue-500',
    bg: 'bg-blue-500/20',
  },
  Varsity: {
    primary: 'text-orange-400',
    secondary: 'text-orange-500',
    bg: 'bg-orange-500/20',
  },
  D1: {
    primary: 'text-purple-400',
    secondary: 'text-purple-500',
    bg: 'bg-purple-500/20',
  },
};

/**
 * Get all items for a specific level store
 */
export function getLevelItems(level: UserLevel): StoreItem[] {
  return levelStoreItems[level] || [];
}

/**
 * Get free-eligible items for a level
 */
export function getFreeEligibleItems(level: UserLevel, type: 'clothing' | 'accessory'): StoreItem[] {
  const items = levelStoreItems[level] || [];
  return items.filter(item => {
    if (!item.isFreeEligible) return false;
    if (type === 'accessory') return item.type === 'accessory';
    return item.type !== 'accessory';
  });
}
