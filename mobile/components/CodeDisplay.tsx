import { StyleSheet, View } from 'react-native';

import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

/** The player's 4-digit check-in code, shown once their seat is confirmed. */
export function CodeDisplay({
  code,
  label = 'YOUR CHECK-IN CODE',
  caption,
}: {
  code: string;
  label?: string;
  caption?: string;
}) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${label}: ${code.split('').join(' ')}`}>
      <Text variant="eyebrow" color={colors.gold} align="center">
        {label}
      </Text>
      <View style={styles.row}>
        {code.split('').map((d, i) => (
          <View key={i} style={styles.box}>
            <Text style={styles.digit}>{d}</Text>
          </View>
        ))}
      </View>
      {caption ? (
        <Text variant="caption" align="center" color={colors.textMuted}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: radius.xl,
    padding: 18,
    gap: 14,
  },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  box: {
    width: 48,
    height: 58,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceBox,
    borderWidth: 1,
    borderColor: colors.borderBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: { fontFamily: fonts.display, fontSize: 34, color: colors.text },
});
