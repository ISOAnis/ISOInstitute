import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, ModeSwitch, OverallBox, Screen, StatTile, Text } from '@/components';
import { getAdvisoryNote, getCoachFeedback, getCoachMonth, getMyCoach, getRegulars, useData } from '@/data';
import { useModeSwitch } from '@/features/useModeSwitch';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, pathwayColors, radius, statusColors } from '@/theme';

/** CoachDash: private metrics, tier progress, feedback, board notes, regulars. */
export default function Dashboard() {
  const coachId = useAppStore((s) => s.coachId) ?? '';
  const modeSwitch = useModeSwitch();
  const coach = useData(getMyCoach, []).data;
  const month = useData(() => getCoachMonth(coachId), [coachId]).data;
  const feedback = useData(() => getCoachFeedback(coachId), [coachId]).data ?? [];
  const note = useData(() => getAdvisoryNote(coachId), [coachId]).data;
  const regulars = useData(() => getRegulars(coachId), [coachId]).data ?? [];

  if (!coach) return <Screen>{null}</Screen>;
  const p = pathwayColors[coach.pathway];
  const avg = feedback.length ? feedback.reduce((a, f) => a + f.rating, 0) / feedback.length : coach.rating;

  return (
    <Screen>
      <ModeSwitch {...modeSwitch} />

      <View style={styles.head}>
        <OverallBox value={coach.overall} pathway={coach.pathway} size={64} />
        <View style={styles.flex}>
          <Text variant="pathwayName">{coach.name}</Text>
          <Text variant="caption">
            <Text variant="caption" color={p.text} style={styles.bold}>
              {pathwayName(coach.pathway)} coach
            </Text>{' '}
            · {coach.tier}
          </Text>
        </View>
        <Button label="Public card" variant="outline" height={44} onPress={() => router.push(`/coach/${coach.id}`)} />
      </View>
      <Text variant="tiny" align="center">
        Everything below is private to you
      </Text>

      {month ? (
        <>
          <View style={styles.monthHead}>
            <Text variant="section">THIS MONTH</Text>
            <Text style={styles.delta} color={statusColors.good}>
              +{month.overallDelta} Overall
            </Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.cell}>
              <StatTile value={month.isosHosted} label="ISOs hosted" />
            </View>
            <View style={styles.cell}>
              <StatTile value={month.playersMet} label="Players met" />
            </View>
            <View style={styles.cell}>
              <StatTile value={`${month.showUpRate}%`} label="Show-up rate" />
            </View>
            <View style={styles.cell}>
              <StatTile value={`+${month.newFollowers}`} label="New followers" />
            </View>
          </View>

          <Card style={{ borderColor: statusColors.goldLine }}>
            <Text variant="eyebrow" color={colors.gold}>
              NEXT TIER: {month.nextTier.toUpperCase()} AT {month.nextTierAt}
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.min(100, (coach.overall / month.nextTierAt) * 100)}%` }]} />
            </View>
            <Text variant="caption" color={colors.textBody}>
              {coach.overall} / {month.nextTierAt}
            </Text>
            <Text variant="caption">{month.nextTierNote}</Text>
          </Card>
        </>
      ) : null}

      <View style={styles.monthHead}>
        <Text variant="section">PLAYER FEEDBACK</Text>
        <Text style={styles.delta} color={colors.gold}>
          {avg.toFixed(1)} avg
        </Text>
      </View>
      {feedback.map((f) => (
        <Card key={f.id}>
          <Text variant="body">“{f.quote}”</Text>
          <Text variant="tiny">{f.fromLabel}</Text>
        </Card>
      ))}

      {note ? (
        <Card style={{ backgroundColor: p.tint, borderColor: p.line }}>
          <Text variant="eyebrow" color={p.text}>
            FROM THE ADVISORY BOARD
          </Text>
          <Text variant="body">{note.body}</Text>
          {note.eventId ? <Button label="See the event" variant="outline" height={44} onPress={() => router.push('/coach-events')} /> : null}
        </Card>
      ) : null}

      <Text variant="section">YOUR REGULARS</Text>
      {regulars
        .filter((r) => r.isosWithCoach > 1)
        .map((r) => (
          <Card key={r.playerId} style={styles.regular}>
            <Avatar initials={r.initials} size={40} pathway={r.pathway} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{r.name}</Text>
              <Text variant="tiny">
                {pathwayName(r.pathway)} · {r.rank} · {r.isosWithCoach} of your ISOs
              </Text>
            </View>
          </Card>
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontFamily: fonts.bold },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  monthHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  delta: { fontFamily: fonts.extrabold, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  cell: { width: '50%', padding: 4, flexDirection: 'row' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceBox, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.gold },
  regular: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
