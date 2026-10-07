import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Icon, Text } from '@/components';
import { canMoveIso, useData, type ShortTable } from '@/data';
import { shortDate, startTime } from '@/lib/format';
import { useAppStore } from '@/store';
import { alpha, colors, statusColors } from '@/theme';

const MOVES = [
  { days: 1, label: '+1 day' },
  { days: 2, label: '+2 days' },
  { days: 7, label: 'Next week' },
];

const shifted = (at: string, days: number) => {
  const d = new Date(at);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

/** Under 2 confirmed inside 24h: move the time or cancel with no penalty. An ISO is never a one-on-one. */
export function ShortTableCard({ table }: { table: ShortTable }) {
  const { moveIso, cancelShortIso } = useAppStore.getState();
  const [moving, setMoving] = useState(false);
  const [days, setDays] = useState<number | null>(null);
  const [error, setError] = useState('');
  const { iso, confirmed } = table;
  const open = useData(() => Promise.all(MOVES.map((m) => canMoveIso(iso.id, m.days))), [iso.id]).data ?? [];

  const move = async () => {
    if (days === null) return;
    try {
      await moveIso(iso.id, days);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <Icon name="alert" size={20} color={statusColors.bad} />
        <Text variant="eyebrow" color={statusColors.bad}>
          {Math.round(table.hoursLeft)}h out · {confirmed} of 2 confirmed
        </Text>
      </View>
      <Text variant="cardTitle">“{iso.title}” needs one more player</Text>
      <Text variant="body">
        An ISO is never a one-on-one. Move it to a time more players can make, or cancel. Either way there’s no penalty for you or your players.
      </Text>

      {moving ? (
        <View style={styles.group}>
          <Text variant="section">Same time and spot, new day</Text>
          <View style={styles.chips}>
            {MOVES.map((m, i) => (
              <Chip
                key={m.days}
                label={`${m.label} · ${open[i] === false ? 'spot full' : shortDate(shifted(iso.startsAt, m.days))}`}
                active={days === m.days}
                onPress={() => open[i] !== false && setDays(m.days)}
              />
            ))}
          </View>
          {days !== null ? (
            <Text variant="caption">
              Moves to {shortDate(shifted(iso.startsAt, days))}, {startTime(iso.startsAt)}. Confirmed players keep their seats and get pinged.
            </Text>
          ) : null}
          {error ? (
            <Text variant="caption" color={statusColors.bad}>
              {error}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button label="Back" variant="outline" height={44} onPress={() => setMoving(false)} style={styles.flex} />
            <Button label="Move it" height={44} disabled={days === null} onPress={move} style={styles.flex} />
          </View>
        </View>
      ) : (
        <View style={styles.stack}>
          <Button label="Move the time" height={44} onPress={() => setMoving(true)} />
          <Button label="Cancel, no penalty" variant="outline" height={44} onPress={() => cancelShortIso(iso.id)} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: alpha(statusColors.bad, 0.4), gap: 10 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  group: { gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actions: { flexDirection: 'row', gap: 10 },
  stack: { gap: 8 },
  flex: { flex: 1 },
});
