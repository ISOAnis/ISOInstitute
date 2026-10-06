import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

export function StatTile({ value, label, valueColor = colors.text }: { value: string | number; label: string; valueColor?: string }) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${value} ${label}`}>
      <Text style={styles.value} color={valueColor}>
        {value}
      </Text>
      <Text variant="caption">{label}</Text>
    </View>
  );
}

/** Row of equal-width stat tiles. */
export function StatRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surface1,
    gap: 2,
  },
  value: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 32 },
});
