import { StyleSheet, View } from 'react-native';

import { Text } from '@/components';
import { COACH_APPLY_STEPS, coachApplyMinutesLeft, type CoachApplyStep } from '@/data';
import { colors } from '@/theme';

/** Step count, time left, and a gold bar. With no step it's the intro, before anything is filled in. */
export function ApplyProgress({ step }: { step?: CoachApplyStep }) {
  const total = COACH_APPLY_STEPS.length;
  const index = step ? COACH_APPLY_STEPS.findIndex((s) => s.id === step) : -1;
  const minutes = coachApplyMinutesLeft(step);
  const filled = (index + 1) / total;

  return (
    <View style={styles.wrap} accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: index + 1 }}>
      <View style={styles.row}>
        <Text variant="eyebrow">{step ? `Step ${index + 1} of ${total}` : 'Coach application'}</Text>
        <Text variant="caption">About {minutes} min left</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${filled * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.surface3, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: colors.gold },
});
