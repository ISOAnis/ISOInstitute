import { Pressable, StyleSheet } from 'react-native';

import type { PathwayId } from '@/data';
import { colors, fonts, layout, pathwayColors, radius } from '@/theme';

import { PathwayDot } from './PathwayDot';
import { Text } from './Text';

/**
 * Filter pill. Pathway pills fill with the pathway color when active;
 * non-pathway pills (Recommended, Following) pass `dotColor` and fill gold.
 */
export function Pill({
  label,
  active,
  onPress,
  pathway,
  dotColor,
}: {
  label: string;
  active: boolean;
  onPress?: () => void;
  pathway?: PathwayId;
  dotColor?: string;
}) {
  const fill = pathway ? pathwayColors[pathway].fill : colors.gold;
  const ink = pathway ? pathwayColors[pathway].ink : colors.onGold;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      style={[
        styles.pill,
        active ? { backgroundColor: fill, borderColor: fill } : { backgroundColor: colors.surfaceAlt, borderColor: colors.borderChip },
      ]}
    >
      {!active ? <PathwayDot pathway={pathway} color={dotColor} /> : null}
      <Text
        variant="caption"
        style={[styles.label, { fontFamily: active ? fonts.extrabold : fonts.semibold }]}
        color={active ? ink : colors.textBody}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: layout.pillHeight,
    minWidth: 44,
    paddingHorizontal: 15,
    borderRadius: radius.xxl,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  label: { fontSize: 13 },
});
