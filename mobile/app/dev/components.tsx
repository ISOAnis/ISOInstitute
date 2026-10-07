import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BottomSheet, Button, CoachCardFull, CodeDisplay, IconButton, IsoCard, ModeSwitch, PathwayDot, Pill, Screen, Text } from '@/components';
import { getCoach, getIsos, getPathways, getSavedCard, useData, type IsoFilter } from '@/data';
import { ClusterBubble, IsoDot } from '@/features/map/IsoDot';
import { useAppStore } from '@/store';
import { colors, pathwayColors, pathwayOrder, radius } from '@/theme';

const DEMO_ISO = 'iso-mr-tue';

type PillKey = 'recommended' | 'following' | (typeof pathwayOrder)[number];

const toFilter = (k: PillKey): IsoFilter =>
  k === 'recommended' ? { kind: 'recommended' } : k === 'following' ? { kind: 'following' } : { kind: 'pathway', pathway: k };

/** Phase 1 review screen: every shared component, wired to the data layer and store. */
export default function ComponentGallery() {
  const revision = useAppStore((s) => s.revision);
  const follows = useAppStore((s) => s.follows);
  const mySeat = useAppStore((s) => s.seats[DEMO_ISO]);
  const mode = useAppStore((s) => s.mode);
  const { setMode, toggleFollow, gotNext, confirmSeat, giveUpSeat } = useAppStore.getState();

  const [pill, setPill] = useState<PillKey>('recommended');
  const [selected, setSelected] = useState<string | null>(null);
  const [holdOpen, setHoldOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const pathways = useData(getPathways, []).data ?? [];
  const all = useData(() => getIsos(), [revision]).data ?? [];
  const shown = useData(() => getIsos(toFilter(pill)), [pill, revision]).data ?? [];
  const coach = useData(() => getCoach('marcus'), []).data;
  const card = useData(getSavedCard, []).data;

  const shownIds = new Set(shown.map((i) => i.id));
  const current = shown.find((i) => i.id === selected) ?? shown[0];
  const following = follows.includes('marcus');

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="back" label="Back" onPress={() => router.back()} />
        <Text variant="topLabel">Phase 1 · Components</Text>
        <View style={styles.spacer} />
      </View>

      <Section title="Pill and PathwayDot">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          <Pill label="Recommended" active={pill === 'recommended'} onPress={() => setPill('recommended')} />
          <Pill label="Following" dotColor={colors.textSecondary} active={pill === 'following'} onPress={() => setPill('following')} />
          {pathwayOrder.map((id) => (
            <Pill key={id} pathway={id} label={pathways.find((p) => p.id === id)?.name ?? id} active={pill === id} onPress={() => setPill(id)} />
          ))}
        </ScrollView>
        <View style={styles.row}>
          {pathwayOrder.map((id) => (
            <View key={id} style={styles.dotItem}>
              <PathwayDot pathway={id} size={12} />
              <Text variant="caption" color={pathwayColors[id].text}>
                {id}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Map dots (dim outside current pill)">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {all.map((iso) => (
            <Pressable key={iso.id} accessibilityRole="button" accessibilityLabel={`${iso.title}, ${iso.areaName}`} onPress={() => setSelected(iso.id)}>
              <IsoDot pathway={iso.pathway} selected={current?.id === iso.id} dimmed={!shownIds.has(iso.id)} full={iso.seatsOpen === 0} />
            </Pressable>
          ))}
          <ClusterBubble count={4} />
        </ScrollView>
      </Section>

      <Section title="IsoCard">
        <View style={styles.sheetMock}>
          {current ? (
            <IsoCard
              iso={current}
              reasons={'recommendation' in current ? current.recommendation?.reasons : undefined}
              onCoachCard={() => setNotice(`Coach card: ${current.coach.name}`)}
              onView={() => setNotice(`View ISO: ${current.title}`)}
            />
          ) : (
            <Text variant="subtitle">No ISOs for this pill this week.</Text>
          )}
        </View>
        {notice ? <Text variant="caption">{notice}</Text> : null}
      </Section>

      <Section title="CoachCardFull and follow (store)">
        {coach ? <CoachCardFull coach={coach} /> : null}
        <Button
          label={following ? 'Following · pins on' : `Follow ${coach?.firstName ?? ''}`}
          variant={following ? 'outline' : 'primary'}
          icon={following ? 'bell' : undefined}
          height={52}
          onPress={() => toggleFollow('marcus')}
        />
        <Text variant="caption" align="center">
          Switch to the Following pill above to see this change the feed.
        </Text>
      </Section>

      <Section title="BottomSheet and CodeDisplay (seat flow)">
        <Text variant="caption">Seat at “From side hustle to storefront”: {mySeat?.status ?? 'none'}</Text>
        {!mySeat || mySeat.status === 'cancelled' ? <Button label="I got next" onPress={() => setHoldOpen(true)} height={52} /> : null}
        {mySeat?.status === 'requested' ? <Button label="Simulate: Marcus approves" variant="outline" onPress={() => confirmSeat(DEMO_ISO, 'me')} /> : null}
        {mySeat?.checkinCode && mySeat.status === 'confirmed' ? (
          <>
            <CodeDisplay
              code={mySeat.checkinCode}
              caption="Give this to Marcus when you pull up. It checks you in, releases your $5 hold, and counts toward your rank."
            />
            <Button
              label="Give up my spot"
              variant="outline"
              onPress={async () => {
                const r = await giveUpSeat(DEMO_ISO);
                setNotice(r.holdReleased ? 'Spot released · $5 returned' : 'Spot released · $5 to the Community Pool');
              }}
            />
          </>
        ) : null}
      </Section>

      <Section title="ModeSwitch (store)">
        <ModeSwitch mode={mode} onChange={setMode} badge={3} />
        <Text variant="caption">Mode in store: {mode}</Text>
      </Section>

      <BottomSheet visible={holdOpen} onClose={() => setHoldOpen(false)} eyebrow="I got next" title="Save your seat with a $5 hold">
        <View style={styles.cardRow}>
          <Text variant="bodyStrong">$5.00 hold</Text>
          <Text variant="caption">Card ending {card?.last4} · not a charge</Text>
        </View>
        <View style={styles.row}>
          <Button label="Not yet" variant="outline" style={styles.flex} onPress={() => setHoldOpen(false)} />
          <Button
            label="Confirm"
            style={styles.flex}
            onPress={async () => {
              await gotNext(DEMO_ISO);
              setHoldOpen(false);
            }}
          />
        </View>
      </BottomSheet>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="section">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: 44 },
  section: { gap: 10, marginTop: 8 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dotItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sheetMock: {
    backgroundColor: colors.surface1,
    borderRadius: radius.sheet,
    padding: 16,
  },
  cardRow: {
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
    gap: 2,
  },
  flex: { flex: 1 },
});
