import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Field, Icon, ListRow, Screen, Text, Toggle, TopBar } from '@/components';
import {
  getCoachVenues,
  getMyCoach,
  getPinBlocker,
  getSlotAvailability,
  getSlotSuggestions,
  now,
  SEAT_RANGE,
  useData,
  type IsoSummary,
  type SlotStatus,
  type SlotSuggestion,
  type Venue,
  type GroupFor,
} from '@/data';
import { applyStepHref } from '@/features/apply/steps';
import { clockLabel, isoDate, parseClock, startTime, timeRange } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, pathwayColors, radius, statusColors } from '@/theme';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const GROUP_OPTIONS: { id: GroupFor | undefined; label: string }[] = [
  { id: undefined, label: 'Everyone' },
  { id: 'women', label: 'Women’s ISO' },
  { id: 'men', label: 'Men’s ISO' },
];

const SEAT_OPTIONS = Array.from({ length: SEAT_RANGE.max - SEAT_RANGE.min + 1 }, (_, i) => SEAT_RANGE.min + i);

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

const isosWord = (n: number) => (n === 1 ? 'ISO' : 'ISOs');

/** "room for 1 more ISO" / "full · 2 ISOs booked" */
function availability(slot: SlotStatus) {
  if (slot.open > 0) return `room for ${slot.open} more ${isosWord(slot.open)}`;
  return `full · ${slot.maxTables} ${isosWord(slot.maxTables)} booked`;
}

export default function DropPin() {
  const dropPin = useAppStore((s) => s.dropPin);
  const revision = useAppStore((s) => s.revision);
  const coach = useData(getMyCoach, []).data;
  const venues = useData(getCoachVenues, []).data ?? [];
  const blocker = useData(getPinBlocker, [revision]).data;
  const days = dayOptions();

  const [title, setTitle] = useState('');
  const params = useLocalSearchParams<{ venue?: string }>();
  const [venueId, setVenueId] = useState<string | null>(params.venue ?? null);
  const [day, setDay] = useState(3);
  const [start, setStart] = useState('12:00 PM');
  const [end, setEnd] = useState('2:00 PM');
  const [seats, setSeats] = useState(3);
  const [approve, setApprove] = useState(true);
  const [reveal, setReveal] = useState(true);
  const [groupFor, setGroupFor] = useState<GroupFor | undefined>(undefined);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<IsoSummary | null>(null);

  const chosenVenue = venueId ?? venues[0]?.id;
  const date = isoDate(days[day].date);
  const s24 = parseClock(start);
  const e24 = parseClock(end);
  const timesOk = !!s24 && !!e24 && e24 > s24;

  const slots = useData(() => (timesOk ? getSlotAvailability(date, s24!, e24!) : Promise.resolve([])), [date, s24, e24, revision]).data ?? [];
  const slotOf = (id?: string) => slots.find((x) => x.venueId === id);
  const chosen = slotOf(chosenVenue);
  const full = !!chosen && chosen.open === 0;
  const suggestions = useData(
    () => (full && chosenVenue && timesOk ? getSlotSuggestions(chosenVenue, date, s24!, e24!) : Promise.resolve(null)),
    [full, chosenVenue, date, s24, e24, revision],
  ).data;

  const slotLabel = timesOk ? `${days[day].label} ${startTime(`${date}T${s24}:00`)}` : '';
  const venueById = (id: string) => venues.find((v) => v.id === id);

  const applySuggestion = (sug: SlotSuggestion) => {
    setVenueId(sug.venueId);
    setStart(clockLabel(sug.start));
    setEnd(clockLabel(sug.end));
  };

  const submit = async () => {
    if (!timesOk) return setError('Times should look like 12:00 PM, with the end after the start.');
    if (!chosenVenue) return setError('Pick an ISO Partner spot.');
    try {
      setError('');
      const iso = await dropPin({
        title,
        venueId: chosenVenue,
        date,
        start: s24!,
        end: e24!,
        seats,
        approveRequests: approve,
        revealSpot24h: reveal,
        groupFor,
      });
      setCreated(iso);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (blocker) {
    return (
      <Screen>
        <TopBar label="Coach account" onBack={() => router.back()} />
        <View style={styles.done}>
          <View style={styles.doneIcon}>
            <Icon name="idCard" size={32} color={colors.gold} />
          </View>
          <Text variant="titleLg" align="center">
            One more step
          </Text>
          <Text variant="subtitle" align="center">
            {blocker}
          </Text>
        </View>
        {coach ? <Button label="Verify your ID" height={52} onPress={() => router.push(applyStepHref('verify', { edit: true }))} /> : null}
      </Screen>
    );
  }

  if (created) {
    return (
      <Screen>
        <TopBar label="Coach account" onBack={() => router.back()} />
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
        <TopBar label="Coach account" onBack={() => router.back()} />
        <Text variant="titleLg">Drop a pin</Text>

        <Field label="Topic" value={title} onChangeText={setTitle} placeholder="From side hustle to storefront" />

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
          <Text variant="section">ISO Partner spot · closest first</Text>
          <Card style={styles.list}>
            {(params.venue ? [...venues].sort((a, b) => Number(b.id === params.venue) - Number(a.id === params.venue)) : venues).map((v, i) => {
              const active = chosenVenue === v.id;
              const slot = slotOf(v.id);
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
                    {slot ? (
                      <Text variant="caption" style={styles.bold} color={slot.open > 0 ? statusColors.good : statusColors.bad}>
                        {slotLabel}: {availability(slot)}
                      </Text>
                    ) : null}
                  </View>
                </ListRow>
              );
            })}
          </Card>

          {full && chosen ? (
            <FullSlotCard slot={chosen} suggestions={suggestions ?? null} dayLabel={days[day].label} venueById={venueById} onApply={applySuggestion} />
          ) : chosen && chosen.booked.length ? (
            <Card style={styles.shared}>
              <Icon name="users" size={20} color={colors.textSecondary} />
              <Text variant="body" style={styles.flex}>
                {chosen.booked.length} other {chosen.booked.length === 1 ? 'ISO' : 'ISOs'} here at this time (
                {chosen.booked.map((b) => pathwayName(b.pathway)).join(', ')}). Your Huddle pin tells your players where you are.
              </Text>
            </Card>
          ) : null}
        </View>

        <View style={styles.group}>
          <Text variant="section">Players</Text>
          <View style={styles.chips}>
            {SEAT_OPTIONS.map((n) => (
              <Chip key={n} label={String(n)} minWidth={56} active={seats === n} onPress={() => setSeats(n)} />
            ))}
          </View>
          <Text variant="caption">2 to 4 players. If only 1 confirms, we’ll help you move it.</Text>
        </View>

        <View style={styles.group}>
          <Text variant="section">Who it’s for</Text>
          <View style={styles.chips}>
            {GROUP_OPTIONS.map((g) => (
              <Chip key={g.label} label={g.label} active={groupFor === g.id} onPress={() => setGroupFor(g.id)} />
            ))}
          </View>
          <Text variant="caption">
            {groupFor ? 'Shows a tag on the map and gets suggested to players who prefer same-gender ISOs.' : 'Open to every player in the pathway.'}
          </Text>
        </View>

        <Card>
          <Toggle title="Approve each request" subtitle="You pick who’s in" value={approve} onChange={setApprove} />
          <Toggle title="Reveal spot 24h before" subtitle="Exact location only goes to confirmed players" value={reveal} onChange={setReveal} />
        </Card>

        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button
          label={full ? 'Pick an open time or spot' : `Drop pin · notify ${coach?.followers ?? 0} followers`}
          height={52}
          disabled={full}
          onPress={submit}
        />
        <Text variant="caption" align="center">
          Hosting counts toward your Overall once players check in
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

function FullSlotCard({
  slot,
  suggestions,
  dayLabel,
  venueById,
  onApply,
}: {
  slot: SlotStatus;
  suggestions: { later: SlotSuggestion | null; nearby: SlotSuggestion | null } | null;
  dayLabel: string;
  venueById: (id: string) => Venue | undefined;
  onApply: (s: SlotSuggestion) => void;
}) {
  const later = suggestions?.later;
  const nearby = suggestions?.nearby;
  const nearVenue = nearby ? venueById(nearby.venueId) : undefined;
  return (
    <Card style={styles.fullCard}>
      <View style={styles.fullHead}>
        <Icon name="alert" size={20} color={statusColors.bad} />
        <Text variant="cardTitle">This spot is full at that time</Text>
      </View>
      <View style={styles.booked}>
        {slot.booked.map((b) => (
          <View key={b.id} style={styles.bookedRow}>
            <Icon name={b.pathway} size={18} color={pathwayColors[b.pathway].text} />
            <View style={styles.flex}>
              <Text variant="bodyStrong" numberOfLines={1}>
                {b.title}
              </Text>
              <Text variant="caption">
                {pathwayName(b.pathway)} · {b.coach.name} · {timeRange(b.startsAt, b.endsAt)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text variant="section">Try instead</Text>
      {later ? (
        <Suggestion
          title={`Same spot, ${dayLabel} ${startTime(`${later.date}T${later.start}:00`)}`}
          sub={`Next open time · ${timeRange(`${later.date}T${later.start}:00`, `${later.date}T${later.end}:00`)}`}
          onPress={() => onApply(later)}
        />
      ) : null}
      {nearby && nearVenue ? (
        <Suggestion title={nearVenue.name} sub={`Nearest open spot · ${nearVenue.distanceMi} mi · same time`} onPress={() => onApply(nearby)} />
      ) : null}
      {!later && !nearby ? <Text variant="caption">No open partner spots nearby at this time. Try another day.</Text> : null}
    </Card>
  );
}

function Suggestion({ title, sub, onPress }: { title: string; sub: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${sub}`}
      onPress={onPress}
      style={({ pressed }) => [styles.suggestion, pressed && { backgroundColor: colors.surface3 }]}
    >
      <View style={styles.flex}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption">{sub}</Text>
      </View>
      <Text style={styles.use} color={colors.gold}>
        Use
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1, gap: 2 },
  flexShrink: { flexShrink: 1 },
  bold: { fontFamily: fonts.bold },
  row: { flexDirection: 'row', gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  group: { gap: 12 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  venueActive: { backgroundColor: colors.surface3 },
  venueHead: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  badge: { fontFamily: fonts.bold, fontSize: 13, color: colors.textSecondary },
  shared: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  fullCard: { borderWidth: 1, borderColor: alpha(statusColors.bad, 0.4), gap: 12 },
  fullHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  booked: { gap: 10 },
  bookedRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
  },
  use: { fontFamily: fonts.bold, fontSize: 15 },
  done: { alignItems: 'center', gap: 10, marginVertical: 40 },
  doneIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: statusColors.goodTint, alignItems: 'center', justifyContent: 'center' },
});
