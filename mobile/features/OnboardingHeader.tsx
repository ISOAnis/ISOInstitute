import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components';
import { colors } from '@/theme';

/** Accent bar in the current color plus "Step N of 3" and segments. */
export function OnboardingHeader({ step, accent }: { step: number; accent?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View>
      {accent ? <View style={[styles.bar, { backgroundColor: accent }]} /> : null}
      <View style={[styles.row, { paddingTop: insets.top + 12 }]}>
        <Text variant="eyebrow">Step {step} of 3</Text>
        <View style={styles.segments}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.segment, { backgroundColor: s <= step ? (accent ?? colors.text) : colors.surface3 }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, zIndex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { width: 28, height: 4, borderRadius: 2 },
});
