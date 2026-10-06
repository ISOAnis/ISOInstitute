import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, TAP } from '@/theme';

const CARD_PAD = 18;

/**
 * A row that sits directly on a Card (no nested box). Rows after the first get a
 * hairline divider; the pressed state spans the card's full width.
 */
export function ListRow({
  children,
  onPress,
  accessibilityLabel,
  divider,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const body = (pressed: boolean) => [styles.row, divider && styles.divider, pressed && styles.pressed, style];
  if (!onPress) return <View style={body(false)}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => body(pressed)}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: TAP,
    marginHorizontal: -CARD_PAD,
    paddingHorizontal: CARD_PAD,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.hairline },
  pressed: { backgroundColor: colors.surface2 },
});
