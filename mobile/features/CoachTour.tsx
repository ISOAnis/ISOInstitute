import { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text, useTabBarHeight } from '@/components';
import { colors, fonts, gutter, radius } from '@/theme';

/** One stop per coach tab, in tab bar order. */
const STEPS = [
  { title: 'Drop a pin from the map', body: 'This is where you’ll choose an ISO partner spot. Tap one and drop a pin to create an ISO there.' },
  { title: 'Manage your ISOs', body: 'Approve who’s got next, see your live pins, and check players in with their codes.' },
  { title: 'Your players', body: 'The players at your tables, and the regulars who follow you and keep coming back.' },
  { title: 'Events', body: 'The Court and other big ISO events across every pathway. RSVP and show up for your players.' },
  { title: 'Your account', body: 'Your stats, feedback, and settings. Touch and hold Me to switch to your player account.' },
];

const RING_W = 72;

/** A short tour of the coach tabs. Dims everything except the tab it's talking about. */
export function CoachTour({ onDone }: { onDone: () => void }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabH = useTabBarHeight();
  const [i, setI] = useState(0);

  const slot = width / STEPS.length;
  const cx = slot * i + slot / 2;
  const last = i === STEPS.length - 1;
  const step = STEPS[i];
  const caretLeft = Math.min(width - gutter - 28, Math.max(gutter + 12, cx - 8)) - gutter;

  return (
    <View style={StyleSheet.absoluteFill} accessibilityViewIsModal>
      <View style={[styles.dim, { left: 0, right: 0, top: 0, bottom: tabH }]} />
      {STEPS.map((_, j) => (j === i ? null : <View key={j} style={[styles.dim, { left: slot * j, width: slot, bottom: 0, height: tabH }]} />))}
      <View
        pointerEvents="none"
        style={[styles.ring, { left: cx - RING_W / 2, bottom: Math.max(insets.bottom, 12) - 6, height: tabH - Math.max(insets.bottom, 12) + 2 }]}
      />

      <View style={[styles.card, { bottom: tabH + 14 }]}>
        <Text variant="eyebrow" color={colors.gold}>
          Welcome, coach · {i + 1} of {STEPS.length}
        </Text>
        <Text variant="cardTitle">{step.title}</Text>
        <Text variant="body">{step.body}</Text>
        <View style={styles.dots}>
          {STEPS.map((_, j) => (
            <View key={j} style={[styles.dot, j === i && styles.dotOn]} />
          ))}
        </View>
        <View style={styles.actions}>
          {last ? (
            <View style={styles.flex} />
          ) : (
            <Pressable accessibilityRole="button" accessibilityLabel="Skip the tour" onPress={onDone} style={styles.skip}>
              <Text style={styles.skipLabel} color={colors.textSecondary}>
                Skip
              </Text>
            </Pressable>
          )}
          <Button label={last ? 'Got it' : 'Next'} height={44} style={styles.next} onPress={last ? onDone : () => setI(i + 1)} />
        </View>
        <View style={[styles.caret, { left: caretLeft }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: { position: 'absolute', backgroundColor: colors.backdrop },
  ring: { position: 'absolute', width: RING_W, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.gold },
  card: {
    position: 'absolute',
    left: gutter,
    right: gutter,
    gap: 8,
    padding: 18,
    borderRadius: radius.card,
    backgroundColor: colors.surface1,
  },
  caret: {
    position: 'absolute',
    bottom: -7,
    width: 16,
    height: 16,
    backgroundColor: colors.surface1,
    transform: [{ rotate: '45deg' }],
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surface3 },
  dotOn: { width: 18, backgroundColor: colors.gold },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  flex: { flex: 1 },
  skip: { minHeight: 44, minWidth: 44, justifyContent: 'center' },
  skipLabel: { fontFamily: fonts.bold, fontSize: 15 },
  next: { minWidth: 120 },
});
