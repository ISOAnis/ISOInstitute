import { Pressable, StyleSheet, View } from 'react-native';

import type { Mode } from '@/data';
import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

/** Player / Coach toggle for approved coaches. `badge` shows pending requests on Coach. */
export function ModeSwitch({ mode, onChange, badge }: { mode: Mode; onChange: (m: Mode) => void; badge?: number }) {
  const option = (value: Mode, label: string) => {
    const active = mode === value;
    return (
      <Pressable
        key={value}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        accessibilityLabel={`${label} mode`}
        onPress={() => onChange(value)}
        style={[styles.opt, active && styles.optActive]}
      >
        <Text style={[styles.label, { fontFamily: active ? fonts.extrabold : fonts.bold }]} color={active ? colors.bg : colors.textSecondary}>
          {label}
        </Text>
        {value === 'coach' && badge ? (
          <View style={[styles.badge, !active && styles.badgeIdle]}>
            <Text style={styles.badgeText} color={colors.text}>
              {badge}
            </Text>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {option('player', 'Player')}
      {option('coach', 'Coach')}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface1,
    alignSelf: 'flex-start',
  },
  opt: {
    minHeight: 36,
    minWidth: 72,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  optActive: { backgroundColor: colors.text },
  label: { fontSize: 14 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 5,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIdle: { backgroundColor: colors.surface2 },
  badgeText: { fontFamily: fonts.extrabold, fontSize: 13 },
});
