import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Avatar,
  BottomSheet,
  Button,
  Card,
  Icon,
  IconButton,
  ModeSwitch,
  Screen,
  StatRow,
  StatTile,
  Text,
} from '@/components';
import { getLocker, getMe, getPastIsos, getPathways, getRankStatus, getRanks, useData, type PathwayId } from '@/data';
import { useModeSwitch } from '@/features/useModeSwitch';
import { shortDate } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, pathwayColors, radius, statusColors, tracking } from '@/theme';

export default function MeScreen() {
  const revision = useAppStore((s) => s.revision);
  const pathway = useAppStore((s) => s.pathway);
  const switchesLeft = useAppStore((s) => s.switchesLeft);
  const coachStatus = useAppStore((s) => s.coachStatus);
  const choosePathway = useAppStore((s) => s.choosePathway);
  const modeSwitch = useModeSwitch();
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
            · {me.city}
          </Text>
        </View>
        <IconButton icon="gear" label="Settings and Playbook" onPress={() => router.push('/playbook')} />
      </View>

      {coachStatus === 'approved' ? <ModeSwitch {...modeSwitch} /> : null}

      <View style={[styles.level, { backgroundColor: p.tint, borderColor: p.line }]}>
        <Text variant="eyebrow" color={p.text}>
          CURRENT LEVEL
        </Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelName}>{rank.current?.level ?? 'Walk-on'}</Text>
          <Text style={styles.levelCount} color={p.text}>
            {rank.count} {name.toUpperCase()} ISOs
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(rank.progress * 100)}%`, backgroundColor: p.fill }]} />
        </View>
        <View style={styles.levelFoot}>
          <Text variant="tiny">{rank.current ? `${rank.current.level} at ${rank.current.minIsos}` : 'Check in to start'}</Text>
          <Text variant="tiny" color={colors.textBody}>
            {rank.next ? `${rank.isosToNext} more ISOs to ${rank.next.level}` : 'Top of the ranks'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="section">YOUR RANKS</Text>
        <Card style={styles.ladder}>
          {ladder.map((r, i) => {
            const reached = rank.count >= r.minIsos;
            const here = rank.current?.level === r.level;
            const next = rank.next?.level === r.level;
            return (
              <View key={r.level} style={[styles.rung, i < ladder.length - 1 && styles.rungLine]}>
                <Text style={styles.rungNum} color={reached ? p.text : colors.textDim}>
                  {r.minIsos}
                </Text>
                <View style={styles.flex}>
                  <Text variant="bodyStrong" color={reached ? colors.text : colors.textMuted}>
                    {r.level}
                  </Text>
                  <Text variant="tiny">{r.unlock}</Text>
                </View>
                {here ? <Badge label="YOU ARE HERE" bg={p.fill} ink={p.ink} /> : null}
                {next ? <Badge label="NEXT" bg={colors.surfaceBox} ink={colors.textBody} /> : null}
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
        <View style={[styles.pathBar, { backgroundColor: p.fill }]} />
        <View style={styles.flex}>
          <Text variant="eyebrow">YOUR PATHWAY</Text>
          <Text variant="pathwayName" color={p.text}>
            {name}
          </Text>
          <Text variant="tiny">
            {switchesLeft} of 2 switches left this month
          </Text>
        </View>
        <Button label="Switch" variant="outline" height={44} disabled={switchesLeft === 0} onPress={() => setSwitching(true)} />
      </Card>

      {rank.next ? (
        <Card style={{ borderColor: statusColors.goldLine }}>
          <Text variant="eyebrow" color={colors.gold}>
            NEXT UNLOCK · {rank.next.level.toUpperCase()}
          </Text>
          <Text variant="rowTitle">{rank.next.level === 'Varsity' ? `${name} Pathway Patch` : rank.next.unlock}</Text>
          <Text variant="caption">
            {rank.next.level === 'Varsity' ? 'Earned, never sold. Plus Varsity gear access.' : `${rank.isosToNext} more ${name} ISOs to get there.`}
          </Text>
        </Card>
      ) : null}

      <View style={styles.section}>
        <Text variant="section">THE LOCKER</Text>
        <View style={styles.locker}>
          {locker.map((item) => {
            const label = item.id === 'patch' ? `${name} Patch` : item.name;
            return (
              <View
                key={item.id}
                style={[
                  styles.lockerItem,
                  item.status === 'unlocked' && { borderColor: colors.gold },
                  item.status === 'locked' && styles.lockerLocked,
                ]}
              >
                <Icon name={item.status === 'locked' ? 'lock' : 'tee'} size={28} color={item.status === 'locked' ? colors.textDim : item.status === 'unlocked' ? colors.gold : p.text} />
                <Text variant="tiny" align="center" color={colors.textBody} style={styles.bold}>
                  {label}
                </Text>
                <Text variant="tiny" align="center">
                  {item.note}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="section">RECENT</Text>
        {recent.map((r) => (
          <Card key={r.id} style={styles.recent}>
            <Avatar initials={r.coachInitials} size={40} pathway={r.pathway} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{r.title}</Text>
              <Text variant="tiny">
                {pathwayName(r.pathway)} · {shortDate(r.date).split(' ').slice(1).join(' ')} · checked in
              </Text>
            </View>
            {r.pathway === pathway ? (
              <Text style={styles.plus} color={p.text}>
                +1 ISO
              </Text>
            ) : (
              <Text variant="tiny">Crossover</Text>
            )}
          </Card>
        ))}
      </View>

      {coachStatus !== 'approved' ? (
        <Card onPress={() => router.push(coachStatus === 'applied' ? '/coach-review' : '/coach-apply')} accessibilityLabel="Coach on ISO">
          <Text variant="eyebrow" color={colors.gold}>
            {coachStatus === 'applied' ? 'APPLICATION IN REVIEW' : 'PULL AS YOU CLIMB'}
          </Text>
          <Text variant="rowTitle">{coachStatus === 'applied' ? 'See where your application stands' : 'Apply to coach on ISO'}</Text>
          <Text variant="caption">Every coach is approved by the ISO advisory board.</Text>
        </Card>
      ) : null}

      <BottomSheet visible={switching} onClose={() => setSwitching(false)} eyebrow={`${switchesLeft} OF 2 SWITCHES LEFT`} title="Switch pathway">
        <Text variant="caption">Your {name} progress stays saved. The new pathway starts its own count.</Text>
        {pathways
          .filter((x) => x.id !== pathway)
          .map((x) => (
            <Pressable key={x.id} accessibilityRole="button" accessibilityLabel={`Switch to ${x.name}`} onPress={() => pick(x.id)} style={styles.switchRow}>
              <View style={[styles.switchBar, { backgroundColor: pathwayColors[x.id].fill }]} />
              <View style={styles.flex}>
                <Text variant="bodyStrong" color={pathwayColors[x.id].text}>
                  {x.name}
                </Text>
                <Text variant="tiny">
                  {x.field} · {me.rankProgress[x.id] ?? 0} ISOs
                </Text>
              </View>
              <Icon name="forward" size={18} color={colors.textMuted} />
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
  section: { gap: 10 },
  level: { borderWidth: 1, borderRadius: radius.xl, padding: 16, gap: 10 },
  levelRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  levelName: { fontFamily: fonts.display, fontSize: 56, lineHeight: 56, color: colors.text },
  levelCount: { fontFamily: fonts.extrabold, fontSize: 12, letterSpacing: tracking(0.12, 12) },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.inset, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  levelFoot: { flexDirection: 'row', justifyContent: 'space-between' },
  ladder: { paddingVertical: 4, gap: 0 },
  rung: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rungLine: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  rungNum: { fontFamily: fonts.display, fontSize: 24, width: 36, textAlign: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.tag },
  badgeText: { fontFamily: fonts.extrabold, fontSize: 9, letterSpacing: 1 },
  pathRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pathBar: { width: 8, alignSelf: 'stretch', borderRadius: 4 },
  locker: { flexDirection: 'row', gap: 8 },
  lockerItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  lockerLocked: { opacity: 0.6 },
  recent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  plus: { fontFamily: fonts.extrabold, fontSize: 13 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  switchBar: { width: 8, height: 36, borderRadius: 4 },
});
