import { Pressable, StyleSheet } from 'react-native';

import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

/** Single-select option chip (cancel reasons, quiz answers, days, seat counts). */
export function Chip({
  label,
  active,
  onPress,
  activeColor = colors.textBody,
  activeInk = colors.onGold,
  minWidth,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
  activeInk?: string;
  minWidth?: number;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.chip,
        { minWidth },
        active ? { backgroundColor: activeColor, borderColor: activeColor } : null,
      ]}
    >
      <Text style={[styles.label, { fontFamily: active ? fonts.extrabold : fonts.semibold }]} color={active ? activeInk : colors.textBody}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderChip,
    backgroundColor: colors.surfaceInset,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 14 },
});
