import { Pressable, StyleSheet } from 'react-native';

import type { PathwayId } from '@/data';
import { colors, fonts, layout, mix, pathwayColors, radius } from '@/theme';

import { Icon } from './Icon';
import { PathwayDot } from './PathwayDot';
import { Text } from './Text';

/**
 * Filter pill. Selected pills invert to a light capsule; the pathway icon stays
 * as the only full-strength color so the selection never reads as a big color block.
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
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      style={({ pressed }) => [styles.pill, { backgroundColor: active ? colors.text : pressed ? colors.surface3 : colors.surface2 }]}
    >
      {pathway ? (
        <Icon name={pathway} size={16} color={active ? mix(pathwayColors[pathway].fill, colors.bg, 0.72) : pathwayColors[pathway].text} />
      ) : dotColor ? (
        <PathwayDot color={dotColor} />
      ) : null}
      <Text variant="caption" style={[styles.label, { fontFamily: active ? fonts.bold : fonts.semibold }]} color={active ? colors.bg : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: layout.pillHeight,
    minWidth: 44,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  label: { fontSize: 14 },
});
