import { Pressable, StyleSheet } from 'react-native';

import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

/** Single-select option chip (cancel reasons, quiz answers, days, seat counts). */
export function Chip({ label, active, onPress, minWidth }: { label: string; active: boolean; onPress: () => void; minWidth?: number }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, { minWidth, backgroundColor: active ? colors.text : pressed ? colors.surface3 : colors.surface2 }]}
    >
      <Text style={[styles.label, { fontFamily: active ? fonts.bold : fonts.semibold }]} color={active ? colors.bg : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15 },
});
