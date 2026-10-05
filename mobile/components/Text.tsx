import { Text as RNText, type TextProps } from 'react-native';

import { textStyles, type TypeVariant } from '@/theme';

export interface Props extends TextProps {
  variant?: TypeVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Text({ variant = 'body', color, align, style, ...rest }: Props) {
  return (
    <RNText
      {...rest}
      style={[textStyles[variant], color ? { color } : null, align ? { textAlign: align } : null, style]}
    />
  );
}
