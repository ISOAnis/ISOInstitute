import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Icon, ListRow, Screen, Text, TopBar } from '@/components';
import { getMatch, getProfileStatus, MATCH_SECTIONS, sectionSummary, useData, type MatchSection, type ProfileOwner } from '@/data';
import { useAppStore } from '@/store';
import { colors, radius } from '@/theme';

/** "Refine your ISO profile": six optional sections that sharpen ISO suggestions. */
export default function RefineProfile() {
  const { who = 'player', fresh } = useLocalSearchParams<{ who?: ProfileOwner; fresh?: string }>();
  const revision = useAppStore((s) => s.revision);
  const status = useData(() => getProfileStatus(who), [who, revision]).data;
  const match = useData(() => getMatch(who), [who, revision]).data?.match;
  const coach = who === 'coach';

  if (!status || !match) return <Screen>{null}</Screen>;
  const open = (section: MatchSection) => router.push({ pathname: '/profile/[section]', params: { section, who } });
  const allDone = status.done >= status.total;

  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      <View style={styles.group}>
        <Text variant="eyebrow">{fresh ? 'Step 2 of 2 · optional' : coach ? 'Your coach profile' : 'Your ISO profile'}</Text>
        <Text variant="titleLg">{coach ? 'Refine your coach profile' : 'Refine your ISO profile'}</Text>
        <Text variant="subtitle">
          {coach ? 'So the players who’d click with you find your ISOs.' : 'Get better suggestions and get the most out of your ISOs.'}
        </Text>
      </View>

      <View style={styles.privacy}>
        <Icon name="lock" size={18} color={colors.gold} />
        <Text variant="caption" style={styles.flex} color={colors.text}>
          {coach
            ? 'Private to you. Players never see these answers. They only shape who gets your ISOs suggested.'
            : 'Private to you. Never shown on your card, at an ISO, or to a coach. Every answer is optional and you can clear it anytime.'}
        </Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(status.done / status.total) * 100}%` }]} />
        </View>
        <Text variant="caption" color={colors.text}>
          {status.done} of {status.total} done
        </Text>
      </View>

      <Card style={styles.list}>
        {MATCH_SECTIONS.map((s, i) => {
          const summary = sectionSummary(s.id, match);
          return (
            <ListRow key={s.id} divider={i > 0} onPress={() => open(s.id)} accessibilityLabel={`${s.title}${summary ? `: ${summary}` : ', not answered'}`}>
              <View style={[styles.check, summary !== undefined && styles.checkOn]}>
                {summary !== undefined ? <Icon name="check" size={14} color={colors.bg} strokeWidth={2.6} /> : null}
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{s.title}</Text>
                <Text variant="caption" numberOfLines={1}>
                  {summary ?? (s.identity ? 'Optional · identity' : 'Optional')}
                </Text>
              </View>
              <Icon name="forward" size={16} color={colors.textSecondary} />
            </ListRow>
          );
        })}
      </Card>

      {allDone ? (
        <Button label="Done" height={52} onPress={() => router.back()} />
      ) : (
        <Button label={status.done ? 'Keep going' : 'Start'} height={52} onPress={() => status.next && open(status.next)} />
      )}
      {!coach ? (
        <Pressable accessibilityRole="link" onPress={() => router.push('/settings')} style={styles.link}>
          <Text variant="bodyStrong" color={colors.textSecondary} align="center">
            Matching preferences
          </Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  flex: { flex: 1, gap: 2 },
  privacy: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  track: { flex: 1, height: 6, borderRadius: radius.pill, backgroundColor: colors.surface3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.pill, backgroundColor: colors.gold },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.surface3, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  link: { minHeight: 44, justifyContent: 'center' },
});
