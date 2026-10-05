import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { Button, Card, Screen, Text } from '@/components';
import { getEvents, useData } from '@/data';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, pathwayColors, radius, tracking } from '@/theme';

/** The Court: curated pathway events. Shared by player and coach tabs. */
export function EventsScreen() {
  const rsvps = useAppStore((s) => s.rsvps);
  const toggleRsvp = useAppStore((s) => s.toggleRsvp);
  const events = useData(getEvents, []).data ?? [];
  const hero = events.find((e) => e.featured);
  const rest = events.filter((e) => !e.featured);

  return (
    <Screen>
      <Text variant="topLabel">CURATED BY ISO · DENVER</Text>
      <Text variant="title">Events</Text>

      {hero ? (
        <View style={[styles.hero, { borderColor: pathwayColors[hero.pathway].line }]}>
          <View style={[styles.art, { backgroundColor: pathwayColors[hero.pathway].tint }]}>
            <Svg width="100%" height="100%" viewBox="0 0 350 150" preserveAspectRatio="xMidYMid slice">
              <Rect x={20} y={14} width={310} height={122} rx={4} stroke={alpha(pathwayColors[hero.pathway].fill, 0.5)} strokeWidth={2} fill="none" />
              <Line x1={175} y1={14} x2={175} y2={136} stroke={alpha(pathwayColors[hero.pathway].fill, 0.5)} strokeWidth={2} />
              <Circle cx={175} cy={75} r={26} stroke={alpha(pathwayColors[hero.pathway].fill, 0.5)} strokeWidth={2} fill="none" />
              <Rect x={20} y={45} width={52} height={60} stroke={alpha(pathwayColors[hero.pathway].fill, 0.35)} strokeWidth={2} fill="none" />
              <Rect x={278} y={45} width={52} height={60} stroke={alpha(pathwayColors[hero.pathway].fill, 0.35)} strokeWidth={2} fill="none" />
            </Svg>
            <View style={[styles.heroTag, { backgroundColor: pathwayColors[hero.pathway].fill }]}>
              <Text style={styles.heroTagText} color={pathwayColors[hero.pathway].ink}>
                {hero.pathway.toUpperCase()} PATHWAY EVENT
              </Text>
            </View>
          </View>
          <View style={styles.heroBody}>
            <Text variant="hero">{hero.title}</Text>
            <Text variant="body">{hero.description}</Text>
            <View style={styles.grid}>
              <Fact label="WHEN" value="[Date] · 1 PM" />
              <Fact label="WHERE" value={hero.venueLabel} />
              <Fact label="TICKET" value={hero.ticketLabel} />
              {hero.prize ? <Fact label="PRIZE" value={hero.prize} /> : null}
            </View>
            {hero.sponsor ? <Text variant="caption">Presented by {hero.sponsor} · Refreshments included</Text> : null}
            {rsvps.includes(hero.id) ? (
              <Button label="You’re in. See you on the court." variant="outline" icon="check" height={52} onPress={() => toggleRsvp(hero.id)} />
            ) : (
              <Button label="RSVP · Limited spots" height={52} onPress={() => toggleRsvp(hero.id)} />
            )}
          </View>
        </View>
      ) : null}

      <Text variant="section">COMING UP BY PATHWAY</Text>
      {rest.map((e) => {
        const p = pathwayColors[e.pathway];
        return (
          <Card key={e.id} style={styles.row}>
            <View style={styles.month}>
              <Text style={styles.monthText} color={colors.gold}>
                {e.monthLabel}
              </Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.pathTag} color={p.text}>
                {e.pathway.toUpperCase()}
              </Text>
              <Text variant="rowTitle">{e.title}</Text>
              <Text variant="caption">{e.description}</Text>
            </View>
          </Card>
        );
      })}

      <Text variant="caption" align="center">
        Top coaches by ISOs hosted and feedback get invited to co-host their pathway’s event.
      </Text>
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text variant="micro">{label}</Text>
      <Text variant="bodyStrong">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  hero: { borderWidth: 1, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.surface },
  art: { height: 150 },
  heroTag: { position: 'absolute', left: 14, top: 14, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.tag },
  heroTagText: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: tracking(0.14, 10) },
  heroBody: { padding: 16, gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  fact: { width: '50%', gap: 2, paddingRight: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  month: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: { fontFamily: fonts.display, fontSize: 22 },
  pathTag: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: tracking(0.16, 10) },
});
