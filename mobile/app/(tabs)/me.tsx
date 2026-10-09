import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, BottomSheet, Button, Card, Icon, IconButton, ListRow, Screen, StatRow, StatTile, Text } from '@/components';
import { getLocker, getMe, getPastIsos, getPathways, getRankStatus, getRanks, useData, type PathwayId } from '@/data';
import { ProfileNudge } from '@/features/ProfileNudge';
import { shortDate, switchesLeftLabel } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, pathwayColors, radius } from '@/theme';

export default function MeScreen() {
  const revision = useAppStore((s) => s.revision);
  const pathway = useAppStore((s) => s.pathway);
  const switchesLeft = useAppStore((s) => s.switchesLeft);
  const coachStatus = useAppStore((s) => s.coachStatus);
  const choosePathway = useAppStore((s) => s.choosePathway);
  const [switching, setSwitching] = useState(false);

  const me = useData(getMe, [revision]).data;
  const rank = useData(() => getRankStatus(pathway), [pathway, revision]).data;
  const ladder = useData(getRanks, []).data ?? [];
  const pathways = useData(getPathways, []).data ?? [];
  const recent = useData(getPastIsos, []).data ?? [];
  const locker = useData(getLocker, []).data ?? [];

  if (!me || !rank) return <Screen>{null}</Screen>;

  const p = pathwayColors[pathway];
  const name = pathwayName(pathway);
  const attended = Object.values(me.rankProgress).reduce((a, b) => a + (b ?? 0), 0);

  const pick = async (id: PathwayId) => {
    await choosePathway(id);
    setSwitching(false);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Avatar initials={me.initials} size={56} pathway={pathway} />
        <View style={styles.flex}>
          <Text variant="pathwayName">{me.name}</Text>
          <Text variant="caption">
            <Text variant="caption" color={p.text} style={styles.bold}>
              {name} pathway
            </Text>{' '}
            · {me.neighborhood || me.city}
          </Text>
        </View>
        <IconButton icon="gear" label="Settings" onPress={() => router.push('/settings')} />
      </View>

      <ProfileNudge />

      <View style={[styles.level, { backgroundColor: alpha(p.fill, 0.12) }]}>
        <Text variant="eyebrow" color={p.text}>
          Current level
        </Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelName}>{rank.current?.level ?? 'Walk-on'}</Text>
          <Text style={styles.levelCount} color={p.text}>
            {rank.count} {name} ISOs
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(rank.progress * 100)}%`, backgroundColor: p.fill }]} />
        </View>
        <View style={styles.levelFoot}>
          <Text variant="caption">{rank.current ? `${rank.current.level} at ${rank.current.minIsos}` : 'Check in to start'}</Text>
          <Text variant="caption" color={colors.text}>
            {rank.next ? `${rank.isosToNext} more ISOs to ${rank.next.level}` : 'Top of the ranks'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="section">Your ranks</Text>
        <Card style={styles.ladder}>
          {ladder.map((r, i) => {
            const reached = rank.count >= r.minIsos;
            const here = rank.current?.level === r.level;
            const next = rank.next?.level === r.level;
            return (
              <View key={r.level} style={[styles.rung, i < ladder.length - 1 && styles.rungLine]}>
                <Text style={styles.rungNum} color={reached ? p.text : colors.textSecondary}>
                  {r.minIsos}
                </Text>
                <View style={styles.flex}>
                  <Text variant="bodyStrong" color={reached ? colors.text : colors.textSecondary}>
                    {r.level}
                  </Text>
                  <Text variant="caption">{r.unlock}</Text>
                </View>
                {here ? <Badge label="You’re here" bg={alpha(p.fill, 0.14)} ink={p.text} /> : null}
                {next ? <Badge label="Next" bg={colors.surface2} ink={colors.text} /> : null}
              </View>
            );
          })}
        </Card>
        <Text variant="caption">Only check-ins at {name} ISOs count. Other pathways earn crossover badges.</Text>
      </View>

      <StatRow>
        <StatTile value={attended} label="ISOs attended" />
        <StatTile value={me.coachesMet} label="Coaches met" />
        <StatTile value={me.eventsAttended} label="Events" />
      </StatRow>

      <Card style={styles.pathRow}>
        <View style={[styles.pathMark, { backgroundColor: alpha(p.fill, 0.14) }]}>
          <Icon name={pathway} size={24} color={p.text} />
        </View>
        <View style={styles.flex}>
          <Text variant="section">Your pathway</Text>
          <Text variant="cardTitle" color={p.text}>
            {name}
          </Text>
          <Text variant="caption">{switchesLeftLabel(switchesLeft)}</Text>
        </View>
        <Button label="Switch" variant="outline" height={44} disabled={switchesLeft === 0} onPress={() => setSwitching(true)} />
      </Card>

      {rank.next ? (
        <Card>
          <Text variant="section">Next unlock · {rank.next.level}</Text>
          <Text variant="rowTitle">{rank.next.level === 'Varsity' ? `${name} Pathway Patch` : rank.next.unlock}</Text>
          <Text variant="caption">
            {rank.next.level === 'Varsity' ? 'Earned, never sold. Plus Varsity gear access.' : `${rank.isosToNext} more ${name} ISOs to get there.`}
          </Text>
        </Card>
      ) : null}

      <View style={styles.section}>
        <Text variant="section">The locker</Text>
        <View style={styles.locker}>
          {locker.map((item) => {
            const label = item.id === 'patch' ? `${name} Patch` : item.name;
            return (
              <View key={item.id} style={[styles.lockerItem, item.status === 'locked' && styles.lockerLocked]}>
                <Icon
                  name={item.status === 'locked' ? 'lock' : 'tee'}
                  size={28}
                  color={item.status === 'locked' ? colors.textSecondary : item.status === 'unlocked' ? colors.text : p.text}
                />
                <Text variant="caption" align="center" color={colors.text} style={styles.bold}>
                  {label}
                </Text>
                <Text variant="caption" align="center">
                  {item.note}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="section">Recent</Text>
        <Card style={styles.list}>
          {recent.map((r, i) => (
            <ListRow key={r.id} divider={i > 0}>
              <Avatar initials={r.coachInitials} size={40} pathway={r.pathway} />
              <View style={styles.flex}>
                <Text variant="bodyStrong">{r.title}</Text>
                <Text variant="caption">
                  {pathwayName(r.pathway)} · {shortDate(r.date).split(' ').slice(1).join(' ')} · checked in
                </Text>
              </View>
              {r.pathway === pathway ? (
                <Text style={styles.plus} color={p.text}>
                  +1 ISO
                </Text>
              ) : (
                <Text variant="caption">Crossover</Text>
              )}
            </ListRow>
          ))}
        </Card>
      </View>

      {coachStatus !== 'approved' ? (
        <Card onPress={() => router.push(coachStatus === 'applied' ? '/coach-review' : '/coach-cohorts')} accessibilityLabel="Coach on ISO">
          <Text variant="section">{coachStatus === 'applied' ? 'Application in review' : 'Pull as you climb'}</Text>
          <Text variant="rowTitle">{coachStatus === 'applied' ? 'See where your application stands' : 'Apply to coach on ISO'}</Text>
          <Text variant="caption">Every coach is approved by the ISO advisory board.</Text>
        </Card>
      ) : null}

      <BottomSheet visible={switching} onClose={() => setSwitching(false)} eyebrow={switchesLeftLabel(switchesLeft)} title="Switch pathway">
        <Text variant="caption">
          Your {name} progress stays saved. The new pathway starts its own count. You can still say “I got next” on any pathway, you just won’t get priority
          there.
        </Text>
        {pathways
          .filter((x) => x.id !== pathway)
          .map((x) => (
            <Pressable key={x.id} accessibilityRole="button" accessibilityLabel={`Switch to ${x.name}`} onPress={() => pick(x.id)} style={styles.switchRow}>
              <View style={[styles.switchMark, { backgroundColor: alpha(pathwayColors[x.id].fill, 0.14) }]}>
                <Icon name={x.id} size={20} color={pathwayColors[x.id].text} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong" color={pathwayColors[x.id].text}>
                  {x.name}
                </Text>
                <Text variant="caption">
                  {x.field} · {me.rankProgress[x.id] ?? 0} ISOs
                </Text>
              </View>
              <Icon name="forward" size={18} color={colors.textSecondary} />
            </Pressable>
          ))}
      </BottomSheet>
    </Screen>
  );
}

function Badge({ label, bg, ink }: { label: string; bg: string; ink: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText} color={ink}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontFamily: fonts.bold },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  section: { gap: 12 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  level: { borderRadius: radius.card, padding: 20, gap: 12 },
  levelRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  levelName: { fontFamily: fonts.display, fontSize: 56, lineHeight: 61, color: colors.text },
  levelCount: { fontFamily: fonts.bold, fontSize: 14 },
  track: { height: 8, borderRadius: 4, backgroundColor: alpha(colors.text, 0.1), overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  levelFoot: { flexDirection: 'row', justifyContent: 'space-between' },
  ladder: { paddingVertical: 6, gap: 0 },
  rung: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rungLine: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  rungNum: { fontFamily: fonts.display, fontSize: 24, width: 36, textAlign: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  badgeText: { fontFamily: fonts.bold, fontSize: 13 },
  pathRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pathMark: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  locker: { flexDirection: 'row', gap: 8 },
  lockerItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: 14,
    borderRadius: radius.card,
    backgroundColor: colors.surface1,
  },
  lockerLocked: { opacity: 0.6 },
  plus: { fontFamily: fonts.bold, fontSize: 14 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  switchMark: { width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
});
