import type { TextStyle } from 'react-native';

import { colors } from './colors';

/**
 * Font family names as registered by useFonts in app/_layout.tsx.
 * Bebas Neue is only for big headlines (24px+), Overall numbers, rank numbers and the check-in code.
 * Manrope carries everything else.
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

/** Bebas caps sit high in the em box; a lineHeight at or below 1 clips them on device. */
const headline = (size: number, lineHeight = 1.08): TextStyle => ({
  fontFamily: fonts.display,
  fontSize: size,
  lineHeight: Math.round(size * lineHeight),
  letterSpacing: tracking(0.01, size),
  textTransform: 'uppercase',
  color: colors.text,
});

const manrope = (family: string, size: number, color: string = colors.text): TextStyle => ({
  fontFamily: family,
  fontSize: size,
  lineHeight: Math.round(size * 1.45),
  color,
});

export const textStyles = {
  /** Screen titles: "ISOs NEAR YOU", "MANAGE YOUR ISOs". */
  title: headline(38),
  titleLg: headline(44),
  /** Hero titles on detail screens. */
  hero: headline(40, 1.05),
  /** Sheet titles: "SAVE YOUR SEAT WITH A $5 HOLD". */
  sheetTitle: headline(30),
  /** Pathway names on the Me / pathway screens. */
  pathwayName: headline(26),
  /** Overall numbers, rank numbers, the check-in code. Size set per use. */
  numeral: { fontFamily: fonts.display, color: colors.text } as TextStyle,
  wordmark: { fontFamily: fonts.display, fontSize: 30, letterSpacing: tracking(0.06, 30), color: colors.gold } as TextStyle,

  /** The one small-caps label a screen may have. */
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: tracking(0.08, 13),
    textTransform: 'uppercase',
    color: colors.textSecondary,
  } as TextStyle,
  /** Section and field labels, sentence case: "What we’ll talk about". */
  section: manrope(fonts.semibold, 13, colors.textSecondary),
  /** Centered top-bar label: "The ISO", "Coach card". */
  topLabel: manrope(fonts.semibold, 15, colors.text),

  body: manrope(fonts.body, 15, colors.text),
  bodyStrong: manrope(fonts.bold, 15, colors.text),
  subtitle: manrope(fonts.body, 15, colors.textSecondary),
  caption: manrope(fonts.body, 13, colors.textSecondary),
  /** Timestamps and other meta. */
  meta: manrope(fonts.medium, 13, colors.textMeta),
  /** Card titles. */
  cardTitle: manrope(fonts.bold, 17, colors.text),
  rowTitle: manrope(fonts.bold, 16, colors.text),
  button: { fontFamily: fonts.bold, fontSize: 16 } as TextStyle,
} as const;

export type TypeVariant = keyof typeof textStyles;
