import { Text as RNText, StyleSheet, type TextProps, type TextStyle } from 'react-native';

import { fonts, textStyles, type TypeVariant } from '@/theme';

export interface Props extends TextProps {
  variant?: TypeVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * A style that overrides fontSize without its own lineHeight would otherwise keep the
 * variant's lineHeight (20 for body) and clip large text, so derive one from the real size.
 */
function fittedLineHeight(base: TextStyle, override: TextStyle): number | undefined {
  if (override.lineHeight !== undefined || override.fontSize === undefined) return undefined;
  const family = override.fontFamily ?? base.fontFamily;
  return Math.ceil(override.fontSize * (family === fonts.display ? 1.1 : 1.45));
}

export function Text({ variant = 'body', color, align, style, ...rest }: Props) {
  const base = textStyles[variant];
  const override = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const lineHeight = fittedLineHeight(base, override);
  return (
    <RNText {...rest} style={[base, align ? { textAlign: align } : null, style, color ? { color } : null, lineHeight !== undefined ? { lineHeight } : null]} />
  );
}
