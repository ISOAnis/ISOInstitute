import { Pressable, StyleSheet } from 'react-native';

import type { PathwayId } from '@/data';
import { colors, fonts, mix, pathwayColors, radius } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

/** Single-select option chip (cancel reasons, quiz answers, days, seat counts). */
export function Chip({
  label,
  active,
  onPress,
  minWidth,
  pathway,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  minWidth?: number;
  pathway?: PathwayId;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, { minWidth, backgroundColor: active ? colors.text : pressed ? colors.surface3 : colors.surface2 }]}
    >
      {pathway ? <Icon name={pathway} size={17} color={active ? mix(pathwayColors[pathway].fill, colors.bg, 0.72) : pathwayColors[pathway].text} /> : null}
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
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15 },
});
