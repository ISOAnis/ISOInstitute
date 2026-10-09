import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Chip, FieldLabel, Icon, ListRow, Screen, Text, TopBar } from '@/components';
import {
  AVAILABILITY_OPTIONS,
  checkCoachHosting,
  getAreas,
  getCoachHosting,
  getVenues,
  HOST_FREQUENCY_OPTIONS,
  SEAT_RANGE,
  useData,
  type Availability,
  type CoachHosting,
} from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { useApplyContinue } from '@/features/apply/steps';
import { useAppStore } from '@/store';
import { colors, statusColors } from '@/theme';

const GROUP_SIZES = Array.from({ length: SEAT_RANGE.max - SEAT_RANGE.min + 1 }, (_, i) => SEAT_RANGE.min + i);

const toggleIn = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

/** Step 6: where and when they'd host, how often, and how many players. No time commitment. */
export default function ApplyHosting() {
  const saved = useData(getCoachHosting, []).data;
  const areas = useData(getAreas, []).data ?? [];
  const venues = useData(getVenues, []).data ?? [];
  const saveCoachHosting = useAppStore((s) => s.saveCoachHosting);
  const goNext = useApplyContinue('guidelines');

  const [form, setForm] = useState<CoachHosting | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (saved && !form) setForm(saved);
  }, [saved, form]);

  if (!form) return <Screen>{null}</Screen>;

  const set = (patch: Partial<CoachHosting>) => {
    setForm({ ...form, ...patch });
    setError('');
  };

  const toggleArea = (area: string) => {
    const next = toggleIn(form.areas, area);
    const keep = form.venueIds.filter((id) => next.includes(venues.find((v) => v.id === id)?.areaName ?? ''));
    set({ areas: next, venueIds: keep });
  };

  const spots = venues.filter((v) => form.areas.includes(v.areaName));

  const next = async () => {
    const problem = checkCoachHosting(form);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      await saveCoachHosting(form);
      goNext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      <ApplyProgress step="hosting" />

      <View style={styles.group}>
        <Text variant="titleLg">When and where</Text>
        <Text variant="subtitle">Roughly where and when you could host. You pick the exact day and spot each time you drop a pin.</Text>
      </View>

      <View style={styles.group}>
        <FieldLabel label="Neighborhoods" required />
        <Text variant="caption">Pick any you’d host in.</Text>
        <View style={styles.chips}>
          {areas.map((a) => (
            <Chip key={a} label={a} active={form.areas.includes(a)} onPress={() => toggleArea(a)} />
          ))}
        </View>
      </View>

      {spots.length ? (
        <View style={styles.group}>
          <FieldLabel label="Partner spots you like" optional />
          <Card style={styles.list}>
            {spots.map((v, i) => {
              const on = form.venueIds.includes(v.id);
              return (
                <ListRow key={v.id} divider={i > 0} accessibilityLabel={v.name} checked={on} onPress={() => set({ venueIds: toggleIn(form.venueIds, v.id) })}>
                  <Icon name={on ? 'shieldCheck' : 'shield'} size={22} color={on ? colors.gold : colors.textSecondary} />
                  <View style={styles.flex}>
                    <Text variant="bodyStrong">{v.name}</Text>
                    <Text variant="caption">
                      {v.areaName} · {v.notes}
                    </Text>
                  </View>
                </ListRow>
              );
            })}
          </Card>
        </View>
      ) : null}

      <View style={styles.group}>
        <FieldLabel label="When are you usually free?" required />
        <View style={styles.chips}>
          {AVAILABILITY_OPTIONS.map((o) => (
            <Chip
              key={o.id}
              label={o.label}
              active={form.availability.includes(o.id)}
              onPress={() => set({ availability: toggleIn<Availability>(form.availability, o.id) })}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <FieldLabel label="How often could you host?" required />
        <View style={styles.chips}>
          {HOST_FREQUENCY_OPTIONS.map((o) => (
            <Chip key={o.id} label={o.label} active={form.frequency === o.id} onPress={() => set({ frequency: o.id })} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <FieldLabel label="Group size" required />
        <Text variant="caption">ISOs are always small groups. You can change this on each pin.</Text>
        <View style={styles.chips}>
          {GROUP_SIZES.map((n) => (
            <Chip key={n} label={`${n} players`} active={form.groupSize === n} onPress={() => set({ groupSize: n })} />
          ))}
        </View>
      </View>

      {error ? (
        <Text variant="caption" color={statusColors.bad}>
          {error}
        </Text>
      ) : null}
      <Button label={saving ? 'Saving…' : 'Continue'} height={52} disabled={saving} onPress={next} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1, gap: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
});
