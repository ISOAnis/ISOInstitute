/** 2pt-based spacing scale matching the reference screens. */
export const space = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 14,
  '3xl': 16,
  '4xl': 18,
  '5xl': 20,
  '6xl': 22,
  '7xl': 24,
} as const;

/** Horizontal screen padding. */
export const gutter = 20;

export const radius = {
  tag: 5,
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 18,
  card: 20,
  sheet: 24,
  pill: 999,
} as const;

/** Minimum touch target (Apple HIG). */
export const TAP = 44;

export const layout = {
  tabBarHeight: 84,
  actionBarHeight: 104,
  buttonHeight: 52,
  pillHeight: 36,
  headerTop: 54,
} as const;
