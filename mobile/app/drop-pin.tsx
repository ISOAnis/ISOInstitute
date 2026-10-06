import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Field, Icon, ListRow, Screen, Text, Toggle, TopBar } from '@/components';
import { getCoachVenues, getMyCoach, now, useData, type IsoSummary } from '@/data';
import { isoDate, parseClock } from '@/lib/format';
import { useAppStore } from '@/store';
import { colors, fonts, statusColors } from '@/theme';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Today, Tomorrow, then the next Thursday and Saturday. */
function dayOptions() {
  const today = now();
  const at = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
  const nextDow = (dow: number) => {
    const diff = (dow - today.getDay() + 7) % 7 || 7;
    return diff < 2 ? diff + 7 : diff;
  };
  return [
    { label: 'Today', date: at(0) },
    { label: 'Tomorrow', date: at(1) },
    { label: DOW[4], date: at(nextDow(4)) },
    { label: DOW[6], date: at(nextDow(6)) },
  ];
}

export default function DropPin() {
  const dropPin = useAppStore((s) => s.dropPin);
  const coach = useData(getMyCoach, []).data;
  const venues = useData(getCoachVenues, []).data ?? [];
  const days = dayOptions();

  const [title, setTitle] = useState('');
  const [venueId, setVenueId] = useState<string | null>(null);
  const [day, setDay] = useState(1);
  const [start, setStart] = useState('12:00 PM');
  const [end, setEnd] = useState('2:00 PM');
  const [seats, setSeats] = useState(3);
  const [approve, setApprove] = useState(true);
  const [reveal, setReveal] = useState(true);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<IsoSummary | null>(null);

  const chosenVenue = venueId ?? venues[0]?.id;

  const submit = async () => {
    const s = parseClock(start);
    const e = parseClock(end);
    if (!s || !e) return setError('Times should look like 12:00 PM.');
    if (!chosenVenue) return setError('Pick an ISO Partner spot.');
    try {
      setError('');
      const iso = await dropPin({
        title,
        venueId: chosenVenue,
        date: isoDate(days[day].date),
        start: s,
        end: e,
        seats,
        approveRequests: approve,
        revealSpot24h: reveal,
      });
      setCreated(iso);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (created) {
    return (
      <Screen>
        <TopBar label="Coach mode" onBack={() => router.back()} />
        <View style={styles.done}>
          <View style={styles.doneIcon}>
            <Icon name="check" size={34} color={statusColors.good} strokeWidth={2.6} />
          </View>
          <Text variant="titleLg" align="center">
            Pin is live.
          </Text>
          <Text variant="subtitle" align="center">
            {coach?.followers ?? 0} followers just got pinged about “{created.title}”.
          </Text>
        </View>
        <Button label="View your ISO" height={52} onPress={() => router.replace(`/iso/${created.id}`)} />
        <Button label="View your card" variant="outline" height={52} onPress={() => router.replace(`/coach/${created.coachId}`)} />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar label="Coach mode" />
        <Text variant="titleLg">Drop a pin</Text>

        <Field label="Topic" value={title} onChangeText={setTitle} placeholder="From side hustle to storefront" />

        <View style={styles.group}>
          <Text variant="section">ISO Partner spot · closest first</Text>
          <Card style={styles.list}>
            {venues.map((v, i) => {
              const active = chosenVenue === v.id;
              return (
                <ListRow key={v.id} divider={i > 0} accessibilityLabel={v.name} onPress={() => setVenueId(v.id)} style={active && styles.venueActive}>
                  <Icon name={active ? 'shieldCheck' : 'shield'} size={22} color={active ? colors.text : colors.textSecondary} />
                  <View style={styles.flex}>
                    <View style={styles.venueHead}>
                      <Text variant="bodyStrong" style={styles.flexShrink}>
                        {v.name}
                      </Text>
                      {v.badge ? <Text style={styles.badge}>{v.badge}</Text> : null}
                    </View>
                    <Text variant="caption">
                      {v.distanceMi} mi · {v.notes}
                    </Text>
                  </View>
                </ListRow>
              );
            })}
          </Card>
        </View>

        <View style={styles.group}>
          <Text variant="section">When</Text>
          <View style={styles.chips}>
            {days.map((d, i) => (
              <Chip key={d.label} label={d.label} active={day === i} onPress={() => setDay(i)} />
            ))}
          </View>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Field label="Start" value={start} onChangeText={setStart} />
            </View>
            <View style={styles.flex}>
              <Field label="End" value={end} onChangeText={setEnd} />
            </View>
          </View>
        </View>

        <View style={styles.group}>
          <Text variant="section">Seats</Text>
          <View style={styles.chips}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Chip key={n} label={String(n)} minWidth={46} active={seats === n} onPress={() => setSeats(n)} />
            ))}
          </View>
          <Text variant="caption">Keep it small. That’s what makes it an ISO.</Text>
        </View>

        <Card>
          <Toggle title="Approve each request" subtitle="You pick who sits at the table" value={approve} onChange={setApprove} />
          <Toggle title="Reveal spot 24h before" subtitle="Exact location only goes to confirmed players" value={reveal} onChange={setReveal} />
        </Card>

        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button label={`Drop pin · notify ${coach?.followers ?? 0} followers`} height={52} onPress={submit} />
        <Text variant="caption" align="center">
          Hosting counts toward your Overall once players check in
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  row: { flexDirection: 'row', gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  group: { gap: 12 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  venueActive: { backgroundColor: colors.surface3 },
  venueHead: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  badge: { fontFamily: fonts.bold, fontSize: 13, color: colors.textSecondary },
  done: { alignItems: 'center', gap: 10, marginVertical: 40 },
  doneIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: statusColors.goodTint, alignItems: 'center', justifyContent: 'center' },
});
