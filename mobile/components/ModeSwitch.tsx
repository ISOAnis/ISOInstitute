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
        <Text style={[styles.label, { fontFamily: active ? fonts.extrabold : fonts.bold }]} color={active ? colors.onGold : colors.textMuted}>
          {label}
        </Text>
        {value === 'coach' && badge ? (
          <View style={[styles.badge, !active && styles.badgeIdle]}>
            <Text style={styles.badgeText} color={colors.gold}>
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
    borderRadius: radius.sheet - 2,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderAlt,
    alignSelf: 'flex-start',
  },
  opt: {
    minHeight: 36,
    minWidth: 72,
    paddingHorizontal: 14,
    borderRadius: radius.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  optActive: { backgroundColor: colors.gold },
  label: { fontSize: 13 },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIdle: { backgroundColor: colors.surfaceBox },
  badgeText: { fontFamily: fonts.extrabold, fontSize: 10 },
});
