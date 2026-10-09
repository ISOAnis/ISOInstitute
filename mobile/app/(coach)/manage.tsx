import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, Icon, ListRow, Screen, Text } from '@/components';
import { displayPoint, regionAround } from '@/features/map/geo';
import { MapCanvas } from '@/features/map/MapCanvas';
import { getCoachIsos, getCoachRequests, getMyCoach, getShortTables, useData, type CoachRequest } from '@/data';
import { ShortTableCard } from '@/features/ShortTableCard';
import { dateBlock, dayLabel, seatsLabel, startTime, timeRange } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, pathwayColors, radius, raisedShadow, statusColors } from '@/theme';

type Outcome = 'approved' | 'declined';

/** CoachMap: today's table, who's got next, live pins, drop a pin. */
export default function ManageIsos() {
  const revision = useAppStore((s) => s.revision);
  const coachId = useAppStore((s) => s.coachId) ?? '';
  const { confirmSeat, declineSeat } = useAppStore.getState();
  const [done, setDone] = useState<Record<string, Outcome>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const coach = useData(getMyCoach, []).data;
  const isos = useData(() => getCoachIsos(coachId), [coachId, revision]).data ?? [];
  const requests = useData(() => getCoachRequests(coachId), [coachId, revision]).data ?? [];
  const short = useData(() => getShortTables(coachId), [coachId, revision]).data ?? [];
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
        <View>
          <Text variant="title">Manage your ISOs</Text>
          <Text variant="subtitle">
            {isos.length} live {isos.length === 1 ? 'pin' : 'pins'} · {requests.length} {requests.length === 1 ? 'player' : 'players'} got next
          </Text>
        </View>

        {short.map((t) => (
          <ShortTableCard key={t.iso.id} table={t} />
        ))}

        {next ? (
          <Card
            onPress={() => router.push(`/check-in/${next.id}`)}
            accessibilityLabel="Check in your players"
            style={[styles.today, { backgroundColor: alpha(p.fill, 0.12) }]}
          >
            <View style={styles.flex}>
              <Text variant="eyebrow" color={p.text}>
                {dayLabel(next.startsAt)} · {startTime(next.startsAt)}
              </Text>
              <Text variant="cardTitle">Check in your players</Text>
              <Text variant="caption" color={colors.text}>
                Enter each player’s 4-digit code
              </Text>
            </View>
            <Icon name="forward" size={22} color={p.text} />
          </Card>
        ) : null}

        <View style={styles.group}>
          <Text variant="section">Who’s got next</Text>
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
                    <Text variant="caption">
                      {r.isCoach ? `${pathwayName(r.playerPathway)} coach` : r.playerRank} · {d.dow[0]}
                      {d.dow.slice(1).toLowerCase()} ISO
                    </Text>
                  </View>
                  <View
                    style={[styles.tag, priority ? { backgroundColor: alpha(pathwayColors[r.iso.pathway].fill, 0.14) } : { backgroundColor: colors.surface2 }]}
                  >
                    <Text style={styles.tagText} color={priority ? pathwayColors[r.iso.pathway].text : colors.text}>
                      {priority ? pathwayName(r.iso.pathway) : 'Open seat'}
                    </Text>
                  </View>
                </View>
                {r.note ? <Text variant="body">“{r.note}”</Text> : null}
                {outcome ? (
                  <Text variant="caption" color={outcome === 'approved' ? statusColors.good : colors.textSecondary}>
                    {outcome === 'approved' ? 'Approved. Spot details go out 24 hrs before.' : 'Declined. They get a kind note and other ISOs to try.'}
                  </Text>
                ) : (
                  <View style={styles.row}>
                    <Button label="Not this time" variant="outline" style={styles.flex} onPress={() => act(r, 'declined')} />
                    <Button label="Approve" variant="light" style={styles.flex} onPress={() => act(r, 'approved')} />
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
        </View>

        <View style={styles.group}>
          <Text variant="section">Your live pins</Text>
          <View style={styles.mini}>
            {isos[0] ? (
              <MapCanvas
                key={isos[0].id}
                isos={isos}
                interactive={false}
                initialRegion={regionAround(displayPoint(isos[0]), 0.4, 2)}
                onSelectIso={(id) => router.push(`/iso/${id}`)}
              />
            ) : null}
          </View>
          {isos.length ? (
            <Card style={styles.list}>
              {isos.map((iso, i) => {
                const d = dateBlock(iso.startsAt);
                return (
                  <ListRow key={iso.id} divider={i > 0} onPress={() => router.push(`/iso/${iso.id}`)} accessibilityLabel={`Open ${iso.title}`}>
                    <View style={styles.date}>
                      <Text style={styles.dow} color={colors.textSecondary}>
                        {d.dow}
                      </Text>
                      <Text style={styles.day}>{d.day}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text variant="bodyStrong">{iso.title}</Text>
                      <Text variant="caption">
                        {timeRange(iso.startsAt, iso.endsAt)} · {iso.areaName} · {seatsLabel(iso.seatsOpen, iso.seats)}
                      </Text>
                    </View>
                    <Icon name="forward" size={18} color={colors.textSecondary} />
                  </ListRow>
                );
              })}
            </Card>
          ) : null}
        </View>
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
  group: { gap: 12 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  today: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reqHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontFamily: fonts.bold, fontSize: 13 },
  mini: { height: 200, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.surface1 },
  date: { width: 44, alignItems: 'center' },
  dow: { fontFamily: fonts.semibold, fontSize: 13 },
  day: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.text },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...raisedShadow,
    shadowOffset: { width: 0, height: 6 },
  },
  fabText: { fontFamily: fonts.bold, fontSize: 16 },
});
