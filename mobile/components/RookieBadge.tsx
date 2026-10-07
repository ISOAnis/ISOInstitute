import { StyleSheet, View } from 'react-native';

import { alpha, colors, fonts, radius, tracking } from '@/theme';

import { Text } from './Text';

/** Shown on a coach's card until their first three ISOs are done. */
export function RookieBadge({ small }: { small?: boolean }) {
  const size = small ? 11 : 12;
  return (
    <View style={[styles.badge, small && styles.small]} accessible accessibilityLabel="Rookie coach">
      <Text style={[styles.label, { fontSize: size, letterSpacing: tracking(0.12, size) }]} color={colors.gold}>
        Rookie
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: alpha(colors.gold, 0.6),
    backgroundColor: alpha(colors.gold, 0.12),
  },
  small: { paddingHorizontal: 8, paddingVertical: 2 },
  label: { fontFamily: fonts.extrabold, textTransform: 'uppercase' },
});
