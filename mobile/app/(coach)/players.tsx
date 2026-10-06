import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Avatar, Card, ListRow, ModeSwitch, Screen, Text } from '@/components';
import { getCoachIsos, getRegulars, getTable, useData, type Seat } from '@/data';
import { useModeSwitch } from '@/features/useModeSwitch';
import { dayLabel } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, statusColors } from '@/theme';

/** Who's sitting at your upcoming tables, plus regulars. */
export default function Players() {
  const coachId = useAppStore((s) => s.coachId) ?? '';
  const revision = useAppStore((s) => s.revision);
  const modeSwitch = useModeSwitch();
  const regulars = useData(() => getRegulars(coachId), [coachId]).data ?? [];
  const tables =
    useData(async () => {
      const isos = await getCoachIsos(coachId);
      return Promise.all(isos.map(async (iso) => ({ iso, seats: await getTable(iso.id) })));
    }, [coachId, revision]).data ?? [];

  return (
    <Screen>
      <ModeSwitch {...modeSwitch} />
      <View>
        <Text variant="title">Your players</Text>
        <Text variant="subtitle">Confirmed seats at your live pins, and the players who keep coming back.</Text>
      </View>

      {tables.map(({ iso, seats }) => (
        <View key={iso.id} style={styles.section}>
          <Text variant="section">
            {dayLabel(iso.startsAt)} · {iso.title}
          </Text>
          <Card onPress={() => router.push(`/check-in/${iso.id}`)} accessibilityLabel={`Check in ${iso.title}`} style={styles.list}>
            {seats.length === 0 ? <Text variant="caption">No one confirmed yet.</Text> : null}
            {seats.map((s: Seat) => (
              <View key={s.playerId} style={styles.row}>
                <Avatar initials={s.playerInitials} size={36} pathway={s.playerPathway} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{s.playerId === 'me' ? 'You' : s.playerName}</Text>
                  <Text variant="caption">
                    {pathwayName(s.playerPathway)} · {s.playerRank}
                  </Text>
                </View>
                <Text style={styles.status} color={s.status === 'checked_in' ? statusColors.good : colors.textSecondary}>
                  {s.status === 'checked_in' ? 'Checked in' : 'Confirmed'}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      ))}

      <View style={styles.section}>
        <Text variant="section">Regulars</Text>
        <Card style={styles.rows}>
          {regulars.map((r, i) => (
            <ListRow key={r.playerId} divider={i > 0}>
              <Avatar initials={r.initials} size={40} pathway={r.pathway} />
              <View style={styles.flex}>
                <Text variant="bodyStrong">{r.name}</Text>
                <Text variant="caption">
                  {pathwayName(r.pathway)} · {r.rank} · {r.isosWithCoach ? `${r.isosWithCoach} of your ISOs` : 'first ISO with you'}
                </Text>
              </View>
            </ListRow>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: 12 },
  list: { gap: 14 },
  rows: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  status: { fontFamily: fonts.bold, fontSize: 13 },
});
