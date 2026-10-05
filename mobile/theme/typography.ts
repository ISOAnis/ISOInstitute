import type { TextStyle } from 'react-native';

import { colors } from './colors';

/**
 * Font family names as registered by useFonts in app/_layout.tsx.
 * Bebas Neue is the brand display face (caps only, single weight); Manrope carries body copy.
 */
export const fonts = {
  display: 'BebasNeue_400Regular',
  body: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

/** CSS em letter-spacing to RN pixels. */
export const tracking = (em: number, fontSize: number) => em * fontSize;

const headline = (size: number, lineHeight = 1): TextStyle => ({
  fontFamily: fonts.display,
  fontSize: size,
  lineHeight: Math.round(size * lineHeight),
  letterSpacing: tracking(0.01, size),
  textTransform: 'uppercase',
  color: colors.text,
});

const eyebrow = (size: number, em: number, color: string = colors.textMuted): TextStyle => ({
  fontFamily: fonts.extrabold,
  fontSize: size,
  letterSpacing: tracking(em, size),
  textTransform: 'uppercase',
  color,
});

export const textStyles = {
  /** Screen titles: "ISOs NEAR YOU", "MANAGE YOUR ISOs". */
  title: headline(38),
  titleLg: headline(44),
  /** Hero titles on detail screens. */
  hero: headline(40, 0.98),
  /** Sheet titles: "SAVE YOUR SEAT WITH A $5 HOLD". */
  sheetTitle: headline(30),
  /** Pathway names in lists. */
  pathwayName: headline(24),
  /** Big numerals: stats, dates, codes. */
  numeral: { fontFamily: fonts.display, color: colors.text } as TextStyle,
  wordmark: { fontFamily: fonts.display, fontSize: 30, letterSpacing: tracking(0.06, 30), color: colors.textBody } as TextStyle,

  /** Section headers: "WHAT WE'LL TALK ABOUT". */
  section: eyebrow(12, 0.18),
  /** Small labels: "YOUR CHECK-IN CODE", "I GOT NEXT". */
  eyebrow: eyebrow(11, 0.16),
  /** Top-bar labels: "THE ISO", "COACH CARD". */
  topLabel: eyebrow(12, 0.2),
  micro: eyebrow(10, 0.14),

  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.textBody } as TextStyle,
  bodyStrong: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: colors.text } as TextStyle,
  subtitle: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.textMuted } as TextStyle,
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.textMuted } as TextStyle,
  tiny: { fontFamily: fonts.body, fontSize: 11, lineHeight: 15, color: colors.textMuted } as TextStyle,
  rowTitle: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.text } as TextStyle,
  button: { fontFamily: fonts.extrabold, fontSize: 15 } as TextStyle,
} as const;

export type TypeVariant = keyof typeof textStyles;
