import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import type { PathwayId } from '@/data';
import { colors, fonts, pathwayColors } from '@/theme';

import { Text } from './Text';

export const AREA_BUBBLE_SIZE = 140;

/**
 * Approximate ISO area on the map: dashed ~5 mi circle with the coach's
 * initials at the center. The exact spot is never shown here.
 */
export function AreaBubble({
  pathway,
  initials,
  selected,
  dimmed,
  onPress,
  accessibilityLabel,
  size = AREA_BUBBLE_SIZE,
}: {
  pathway: PathwayId;
  initials: string;
  selected?: boolean;
  dimmed?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
}) {
  const p = pathwayColors[pathway];
  const [scale] = useState(() => new Animated.Value(selected ? 1.08 : 1));
  const [opacity] = useState(() => new Animated.Value(dimmed ? 0.22 : 1));

  useEffect(() => {
    const cfg = { duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: true };
    Animated.parallel([
      Animated.timing(scale, { toValue: selected ? 1.08 : 1, ...cfg }),
      Animated.timing(opacity, { toValue: dimmed ? 0.22 : 1, ...cfg }),
    ]).start();
  }, [selected, dimmed, scale, opacity]);

  const disc = selected ? 46 : 36;
  return (
    <Animated.View style={{ width: size, height: size, opacity, transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected }}
        onPress={onPress}
        style={[
          styles.area,
          { borderRadius: size / 2, borderColor: p.fill, backgroundColor: p.tint },
        ]}
      >
        <View
          style={[
            styles.glow,
            {
              width: disc + (selected ? 12 : 0),
              height: disc + (selected ? 12 : 0),
              borderRadius: (disc + 12) / 2,
              backgroundColor: selected ? p.glow : 'transparent',
            },
          ]}
        >
          <View style={[styles.disc, { width: disc, height: disc, borderRadius: disc / 2, backgroundColor: p.fill }]}>
            <Text style={styles.initials} color={p.pinInk}>
              {initials}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: { alignItems: 'center', justifyContent: 'center' },
  disc: { borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: fonts.display, fontSize: 16 },
});
