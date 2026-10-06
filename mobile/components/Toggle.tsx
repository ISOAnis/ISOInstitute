import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { Text } from './Text';

/** Settings row with a 52×32 switch. */
export function Toggle({ title, subtitle, value, onChange }: { title: string; subtitle?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={title}
      onPress={() => onChange(!value)}
      style={styles.row}
    >
      <View style={styles.text}>
        <Text variant="bodyStrong">{title}</Text>
        {subtitle ? <Text variant="caption">{subtitle}</Text> : null}
      </View>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.knob, value && styles.knobOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  text: { flex: 1, gap: 2 },
  track: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface3,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: colors.text },
  knob: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.textSecondary },
  knobOn: { alignSelf: 'flex-end', backgroundColor: colors.bg },
});
