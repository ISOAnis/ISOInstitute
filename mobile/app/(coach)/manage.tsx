import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, Icon, IsoMap, ModeSwitch, Screen, Text } from '@/components';
import { getCoachIsos, getCoachRequests, getMyCoach, useData, type CoachRequest } from '@/data';
import { useModeSwitch } from '@/features/useModeSwitch';
import { dateBlock, dayLabel, seatsLabel, startTime, timeRange } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, pathwayColors, radius, statusColors, tracking } from '@/theme';

type Outcome = 'approved' | 'declined';

/** CoachMap: today's table, who's got next, live pins, drop a pin. */
export default function ManageIsos() {
  const revision = useAppStore((s) => s.revision);
  const coachId = useAppStore((s) => s.coachId) ?? '';
  const { confirmSeat, declineSeat } = useAppStore.getState();
  const modeSwitch = useModeSwitch();
  const [done, setDone] = useState<Record<string, Outcome>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const coach = useData(getMyCoach, []).data;
  const isos = useData(() => getCoachIsos(coachId), [coachId, revision]).data ?? [];
  const requests = useData(() => getCoachRequests(coachId), [coachId, revision]).data ?? [];
  const [resolved, setResolved] = useState<CoachRequest[]>([]);

  const next = isos[0];
  const key = (r: CoachRequest) => `${r.isoId}:${r.playerId}`;

  const act = async (r: CoachRequest, outcome: Outcome) => {
    try {
      if (outcome === 'approved') await confirmSeat(r.isoId, r.playerId);
      else await declineSeat(r.isoId, r.playerId);
      setResolved((list) => [...list, r]);
      setDone((d) => ({ ...d, [key(r)]: outcome }));
    } catch (e) {
      setErrors((x) => ({ ...x, [key(r)]: (e as Error).message }));
    }
  };

  const cards = [...requests, ...resolved.filter((r) => !requests.some((q) => key(q) === key(r)))];

  if (!coach) return <Screen>{null}</Screen>;
  const p = pathwayColors[coach.pathway];

  return (
    <View style={styles.root}>
      <Screen contentStyle={{ paddingBottom: 110 }}>
        <ModeSwitch {...modeSwitch} />
        <View>
          <Text variant="title">Manage your ISOs</Text>
          <Text variant="subtitle">
            {isos.length} live {isos.length === 1 ? 'pin' : 'pins'} · {requests.length} {requests.length === 1 ? 'player' : 'players'} got next
          </Text>
        </View>

        {next ? (
          <Card
            onPress={() => router.push(`/check-in/${next.id}`)}
            accessibilityLabel="Check in your table"
            style={[styles.today, { backgroundColor: p.tint, borderColor: p.line }]}
          >
            <View style={styles.flex}>
              <Text variant="eyebrow" color={p.text}>
                {dayLabel(next.startsAt).toUpperCase()} · {startTime(next.startsAt)}
              </Text>
              <Text variant="pathwayName">Check in your table</Text>
              <Text variant="caption" color={colors.textBody}>
                Enter each player’s 4-digit code
              </Text>
            </View>
            <Icon name="forward" size={22} color={p.text} />
          </Card>
        ) : null}

        <Text variant="section">WHO’S GOT NEXT</Text>
        {cards.length === 0 ? <Text variant="caption">No requests right now. They’ll show up here the moment someone says “I got next.”</Text> : null}
        {cards.map((r) => {
          const outcome = done[key(r)];
          const priority = !r.isCoach && r.playerPathway === r.iso.pathway;
          const d = dateBlock(r.iso.startsAt);
          return (
            <Card key={key(r)}>
              <View style={styles.reqHead}>
                <Avatar initials={r.playerInitials} size={44} pathway={r.playerPathway} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{r.isCoach ? `Coach ${r.playerName}` : r.playerName}</Text>
                  <Text variant="tiny">
                    {r.isCoach ? `${pathwayName(r.playerPathway)} coach` : r.playerRank} · {d.dow[0]}
                    {d.dow.slice(1).toLowerCase()} ISO
                  </Text>
                </View>
                <View
                  style={[
                    styles.tag,
                    priority ? { backgroundColor: pathwayColors[r.iso.pathway].fill } : { backgroundColor: colors.borderButton },
                  ]}
                >
                  <Text style={styles.tagText} color={priority ? pathwayColors[r.iso.pathway].ink : colors.textBody}>
                    {priority ? r.iso.pathway.toUpperCase() : 'OPEN SEAT'}
                  </Text>
                </View>
              </View>
              {r.note ? <Text variant="body">“{r.note}”</Text> : null}
              {outcome ? (
                <Text variant="caption" color={outcome === 'approved' ? statusColors.good : colors.textMuted}>
                  {outcome === 'approved'
                    ? 'Approved. Spot details go out 24 hrs before.'
                    : 'Declined. They get a kind note and other ISOs to try.'}
                </Text>
              ) : (
                <View style={styles.row}>
                  <Button label="Not this time" variant="outline" style={styles.flex} onPress={() => act(r, 'declined')} />
                  <Button label="Approve" style={styles.flex} onPress={() => act(r, 'approved')} />
                </View>
              )}
              {errors[key(r)] ? (
                <Text variant="caption" color={statusColors.bad}>
                  {errors[key(r)]}
                </Text>
              ) : null}
            </Card>
          );
        })}

        <Text variant="section">YOUR LIVE PINS</Text>
        <View style={styles.mini}>
          <IsoMap
            isos={isos}
            visibleIds={new Set(isos.map((i) => i.id))}
            focusId={isos[0]?.id}
            draggable={false}
            onSelect={(id) => router.push(`/iso/${id}`)}
          />
        </View>
        {isos.map((iso) => {
          const d = dateBlock(iso.startsAt);
          return (
            <Card key={iso.id} style={styles.pinRow}>
              <View style={styles.date}>
                <Text style={styles.dow} color={colors.gold}>
                  {d.dow}
                </Text>
                <Text style={styles.day}>{d.day}</Text>
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{iso.title}</Text>
                <Text variant="tiny">
                  {timeRange(iso.startsAt, iso.endsAt)} · {iso.areaName} · {seatsLabel(iso.seatsOpen, iso.seats)}
                </Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={`Open ${iso.title}`} hitSlop={10} onPress={() => router.push(`/iso/${iso.id}`)}>
                <Text style={styles.edit} color={colors.gold}>
                  View
                </Text>
              </Pressable>
            </Card>
          );
        })}
      </Screen>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Drop a pin"
        onPress={() => router.push('/drop-pin')}
        style={({ pressed }) => [styles.fab, pressed && { backgroundColor: colors.goldPressed }]}
      >
        <Icon name="plus" size={20} color={colors.onGold} />
        <Text style={styles.fabText} color={colors.onGold}>
          Drop a pin
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: 10 },
  today: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reqHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.tag },
  tagText: { fontFamily: fonts.extrabold, fontSize: 9, letterSpacing: tracking(0.12, 9) },
  mini: { height: 200, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  pinRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  date: { width: 44, alignItems: 'center' },
  dow: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: 1.2 },
  day: { fontFamily: fonts.display, fontSize: 28, lineHeight: 28, color: colors.text },
  edit: { fontFamily: fonts.extrabold, fontSize: 13 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { fontFamily: fonts.extrabold, fontSize: 15 },
});
