import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Text } from '@/components';
import type { PathwayId } from '@/data';
import { alpha, colors, fonts, pathwayColors } from '@/theme';

/** Fixed marker box so the pulse never clips (Android snapshots markers to their bounds). */
export const DOT_BOX = 72;

/**
 * An ISO on the map: a pathway-colored dot with a soft glow and a slow pulse.
 * Full ISOs sit dimmer and still; dots outside the current filter fade to 20%.
 */
export function IsoDot({ pathway, selected, dimmed, full }: { pathway: PathwayId; selected?: boolean; dimmed?: boolean; full?: boolean }) {
  const p = pathwayColors[pathway];
  const pulsing = !dimmed && !full;
  const size = selected ? 22 : 15;
  const glow = size * 2;
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!pulsing) {
      t.stopAnimation();
      t.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [pulsing, t]);

  const circle = (d: number) => ({ width: d, height: d, borderRadius: d / 2 });

  return (
    <View style={[styles.box, { opacity: dimmed ? 0.2 : full ? 0.45 : 1 }]} pointerEvents="none">
      <View style={[styles.abs, circle(glow * 1.25), { backgroundColor: alpha(p.fill, 0.12) }]} />
      <View style={[styles.abs, circle(glow), { backgroundColor: alpha(p.fill, 0.35) }]} />
      {pulsing ? (
        <Animated.View
          style={[
            styles.abs,
            circle(glow),
            {
              backgroundColor: alpha(p.fill, 0.35),
              opacity: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }) }],
            },
          ]}
        />
      ) : null}
      <View style={[circle(size), { backgroundColor: p.fill, borderWidth: 2, borderColor: selected ? colors.text : colors.bg }]} />
    </View>
  );
}

/** Count bubble for overlapping dots when zoomed out. */
export function ClusterBubble({ count }: { count: number }) {
  return (
    <View style={styles.box} pointerEvents="none">
      <View style={[styles.abs, styles.clusterGlow]} />
      <View style={styles.cluster}>
        <Text style={styles.clusterText}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: DOT_BOX, height: DOT_BOX, alignItems: 'center', justifyContent: 'center' },
  abs: { position: 'absolute' },
  clusterGlow: { width: 56, height: 56, borderRadius: 28, backgroundColor: alpha(colors.text, 0.08) },
  cluster: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface3,
    borderWidth: 2,
    borderColor: alpha(colors.text, 0.18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: { fontFamily: fonts.extrabold, fontSize: 15, color: colors.text },
});
