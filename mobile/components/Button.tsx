import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, TAP } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Variant = 'primary' | 'outline' | 'muted' | 'light';

const look: Record<Variant, { bg: string; pressed: string; border: string; ink: string }> = {
  primary: { bg: colors.gold, pressed: colors.goldPressed, border: colors.gold, ink: colors.onGold },
  outline: { bg: 'transparent', pressed: colors.surfaceHigh, border: colors.borderButton, ink: colors.text },
  muted: { bg: colors.avatar, pressed: colors.avatar, border: colors.avatar, ink: colors.textDim },
  light: { bg: colors.textBody, pressed: colors.text, border: colors.textBody, ink: colors.onGold },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  height = 48,
  disabled,
  style,
  children,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  height?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const v = look[disabled ? 'muted' : variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { height: Math.max(TAP, height), backgroundColor: pressed ? v.pressed : v.bg, borderColor: v.border },
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? <Icon name={icon} size={18} color={v.ink} /> : null}
        <Text variant="button" color={v.ink}>
          {label}
        </Text>
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
