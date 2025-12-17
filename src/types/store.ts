// ISO Store System Types

/**
 * User level progression: Freshman → JV → Varsity → D1
 */
export type UserLevel = 'Freshman' | 'JV' | 'Varsity' | 'D1';

/**
 * Store types available in the ISO ecosystem
 */
export type StoreType = 'general' | 'level';

/**
 * Product categories available in the stores
 */
export type ItemCategory = 'shirt' | 'joggers' | 'hat' | 'hoodie' | 'athleisure' | 'accessory';

/**
 * Individual store item/product
 */
export interface StoreItem {
  id: string;
  name: string;
  type: ItemCategory;
  imageUrl: string;
  price: number;
  isFreeEligible: boolean;
  levelRequirement?: UserLevel;
  description?: string;
  colors?: string[];
}

/**
 * Earned reward tracking
 */
export interface EarnedReward {
  id: string;
  levelUnlocked: UserLevel;
  itemId: string | null;
  itemType: 'clothing' | 'accessory';
  claimedAt: Date | null;
  itemName?: string;
}

/**
 * Cart item with quantity
 */
export interface CartItem {
  item: StoreItem;
  quantity: number;
}

/**
 * User profile and progress
 */
export interface User {
  id: string;
  name: string;
  email: string;
  hasLockerRoomPass: boolean;
  currentLevel: UserLevel;
  xp: number;
  xpToNextLevel: number;
  monthlyPurchaseCount: number;
  monthlyPurchaseLimit: number;
  unlockedLevels: UserLevel[];
  earnedRewards: EarnedReward[];
  avatarUrl?: string;
}

/**
 * Level store tier information
 */
export interface LevelTier {
  level: UserLevel;
  title: string;
  description: string;
  tagline: string;
  xpRequired: number;
  previewImages: string[];
  benefits: string[];
}

/**
 * Store state context
 */
export interface StoreState {
  user: User;
  cart: CartItem[];
  activeStore: StoreType | null;
  selectedLevel: UserLevel | null;
  toast: ToastMessage | null;
}

/**
 * Toast notification message
 */
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Level status for UI display
 */
export type LevelStatus = 'locked' | 'unlocked' | 'current';

/**
 * Get level status based on user state
 */
export function getLevelStatus(level: UserLevel, user: User): LevelStatus {
  if (user.currentLevel === level) return 'current';
  if (user.unlockedLevels.includes(level)) return 'unlocked';
  return 'locked';
}

/**
 * Level order for comparison
 */
export const LEVEL_ORDER: UserLevel[] = ['Freshman', 'JV', 'Varsity', 'D1'];

/**
 * Get level index for comparison
 */
export function getLevelIndex(level: UserLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

/**
 * Check if a level is accessible
 */
export function isLevelAccessible(level: UserLevel, user: User): boolean {
  return user.unlockedLevels.includes(level);
}

/**
 * XP thresholds for each level
 */
export const LEVEL_XP_THRESHOLDS: Record<UserLevel, number> = {
  Freshman: 0,
  JV: 1000,
  Varsity: 3000,
  D1: 6000,
};
