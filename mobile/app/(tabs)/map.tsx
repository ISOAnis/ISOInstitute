import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, IsoCard, IsoMap, PathwayDot, Pill, Text } from '@/components';
import { getIsos, useData, type IsoFilter, type IsoListItem, type PathwayId } from '@/data';
import { CoachExplore } from '@/features/CoachExplore';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, gutter, pathwayColors, pathwayOrder, radius, tracking } from '@/theme';

type PillKey = 'recommended' | 'following' | PathwayId;

const toFilter = (k: PillKey): IsoFilter =>
  k === 'recommended' ? { kind: 'recommended' } : k === 'following' ? { kind: 'following' } : { kind: 'pathway', pathway: k };

function subline(k: PillKey) {
  if (k === 'recommended') return 'Picked for your pathway and how you show up';
  if (k === 'following') return 'Pins from coaches you follow';
  return `${pathwayName(k)} ISOs across the Denver metro`;
}

function eyebrow(k: PillKey, iso: IsoListItem) {
  if (k === 'recommended') return `RECOMMENDED · ${iso.recommendation?.match ?? 0}% MATCH`;
  if (k === 'following') return 'FROM A COACH YOU FOLLOW';
  return `${k.toUpperCase()} · NEAR YOU`;
}

export default function MapScreen() {
  const isCoach = useAppStore((s) => s.coachStatus === 'approved');
  if (isCoach) return <CoachExplore />;
  return <PlayerMap />;
}

function PlayerMap() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ pill?: string }>();
  const revision = useAppStore((s) => s.revision);
  const [pill, setPill] = useState<PillKey>((params.pill as PillKey) ?? 'recommended');
  const [index, setIndex] = useState(0);

  const all = useData(() => getIsos(), [revision]).data ?? [];
  const shown = useData(() => getIsos(toFilter(pill)), [pill, revision]).data;
  const list = shown ?? [];
  const current = list.length ? list[Math.min(index, list.length - 1)] : undefined;
  const visible = new Set(list.map((i) => i.id));

  const pick = (k: PillKey) => {
    setPill(k);
    setIndex(0);
  };

  const step = (d: number) => setIndex((i) => (i + d + list.length) % list.length);

  const selectOnMap = (id: string) => {
    const at = list.findIndex((i) => i.id === id);
    if (at >= 0) setIndex(at);
    else router.push(`/iso/${id}`);
  };

  const emptyPath = pill !== 'recommended' && pill !== 'following' ? pill : undefined;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.brandRow}>
          <View style={styles.brand}>
            <Text variant="wordmark">ISO</Text>
            <Text style={styles.brandSub} color={colors.textMuted}>
              IN SEARCH OF
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Change area" style={styles.areaChip}>
            <Icon name="pin" size={14} color={colors.gold} />
            <Text style={styles.areaText}>Denver metro</Text>
          </Pressable>
        </View>
        <View>
          <Text variant="title">ISOs near you</Text>
          <Text variant="subtitle">{subline(pill)}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills} style={styles.pillScroll}>
          <Pill label="Recommended" dotColor={colors.gold} active={pill === 'recommended'} onPress={() => pick('recommended')} />
          <Pill label="Following" dotColor={colors.textMuted} active={pill === 'following'} onPress={() => pick('following')} />
          {pathwayOrder.map((id) => (
            <Pill key={id} pathway={id} label={pathwayName(id)} active={pill === id} onPress={() => pick(id)} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.mapArea}>
        <IsoMap isos={all} visibleIds={visible} focusId={current?.id} onSelect={selectOnMap} />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          {current ? (
            <IsoCard
              iso={current}
              eyebrow={eyebrow(pill, current)}
              counter={`${list.indexOf(current) + 1} of ${list.length}`}
              reasons={pill === 'recommended' ? current.recommendation?.reasons : undefined}
              onPrev={list.length > 1 ? () => step(-1) : undefined}
              onNext={list.length > 1 ? () => step(1) : undefined}
              onCoachCard={() => router.push(`/coach/${current.coachId}`)}
              onView={() => router.push(`/iso/${current.id}`)}
            />
          ) : shown ? (
            <View style={styles.empty}>
              <PathwayDot color={emptyPath ? pathwayColors[emptyPath].fill : colors.textMuted} size={14} />
              <Text variant="rowTitle" style={styles.emptyTitle}>
                {emptyPath ? `No ${pathwayName(emptyPath)} ISOs this week` : 'No pins from coaches you follow'}
              </Text>
              <Text variant="subtitle" align="center">
                Follow coaches in this pathway and you’ll get pinged the moment one drops a pin.
              </Text>
              <Button label="Browse coaches" variant="outline" height={44} onPress={() => router.push('/coaches')} />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: gutter, gap: 14, backgroundColor: colors.bg, zIndex: 2 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  brandSub: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: tracking(0.22, 10) },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.borderChip,
    backgroundColor: colors.surfaceAlt,
  },
  areaText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textBody },
  pillScroll: { marginHorizontal: -gutter },
  pills: { gap: 8, paddingHorizontal: gutter, paddingBottom: 12 },
  mapArea: { flex: 1 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: 1,
    borderColor: colors.borderAlt,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 18,
    gap: 12,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 18, paddingHorizontal: 8 },
  emptyTitle: { fontSize: 16 },
});
