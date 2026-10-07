import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components';
import { getProfileStatus, useData, type ProfileOwner } from '@/data';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, radius } from '@/theme';

/**
 * The staged onboarding entry point. First "Complete onboarding" (basics), then
 * "Refine your ISO profile" (match sections). Disappears once everything is answered.
 */
export function ProfileNudge({ who = 'player' }: { who?: ProfileOwner }) {
  const revision = useAppStore((s) => s.revision);
  const status = useData(() => getProfileStatus(who), [who, revision]).data;
  if (!status) return null;

  const basics = who === 'player' && !status.basicsDone;
  if (!basics && status.done >= status.total) return null;

  const title = basics ? 'Complete onboarding' : who === 'coach' ? 'Refine your coach profile' : 'Refine your ISO profile';
  const sub = basics
    ? 'Add your name, where you’d pull up from, and where you’re at. Takes a minute.'
    : who === 'coach'
      ? 'So the players who’d click with you find your ISOs.'
      : 'Get better suggestions and get the most out of your ISOs.';
  const go = () => router.push(basics ? '/profile/basics' : { pathname: '/profile/refine', params: { who } });

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={go} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.mark}>
        <Icon name={basics ? 'user' : 'sparkle'} size={20} color={colors.gold} />
      </View>
      <View style={styles.body}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption">{sub}</Text>
        {basics ? null : (
          <View style={styles.progressRow}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(status.done / status.total) * 100}%` }]} />
            </View>
            <Text style={styles.count} color={colors.gold}>
              {status.done} of {status.total}
            </Text>
          </View>
        )}
      </View>
      <Icon name="forward" size={16} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: alpha(colors.gold, 0.35),
    backgroundColor: alpha(colors.gold, 0.08),
  },
  pressed: { backgroundColor: alpha(colors.gold, 0.14) },
  mark: { width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(colors.gold, 0.14) },
  body: { flex: 1, gap: 3 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  track: { flex: 1, height: 6, borderRadius: radius.pill, backgroundColor: colors.surface3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.pill, backgroundColor: colors.gold },
  count: { fontFamily: fonts.bold, fontSize: 12 },
});
