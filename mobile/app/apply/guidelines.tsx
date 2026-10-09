import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, FieldLabel, Icon, ListRow, Screen, Text, TopBar } from '@/components';
import { COACH_GUIDELINES, getCoachGuidelinesAgreed, useData } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { useApplyContinue } from '@/features/apply/steps';
import { useAppStore } from '@/store';
import { colors, radius, statusColors } from '@/theme';

/** Step 7: five community guidelines. Every one has to be checked. */
export default function ApplyGuidelines() {
  const { data: agreed, loading } = useData(getCoachGuidelinesAgreed, []);
  const agreeCoachGuidelines = useAppStore((s) => s.agreeCoachGuidelines);
  const goNext = useApplyContinue('verify');

  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !checked) setChecked(COACH_GUIDELINES.map(() => !!agreed));
  }, [loading, agreed, checked]);

  if (!checked) return <Screen>{null}</Screen>;

  const count = checked.filter(Boolean).length;
  const all = count === COACH_GUIDELINES.length;

  const toggle = (i: number) => setChecked(checked.map((c, j) => (j === i ? !c : c)));

  const next = async () => {
    if (!all) return;
    setSaving(true);
    try {
      await agreeCoachGuidelines();
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
      <ApplyProgress step="guidelines" />

      <View style={styles.group}>
        <Text variant="titleLg">Community guidelines</Text>
        <Text variant="subtitle">Every ISO coach agrees to these. They keep ISOs safe and worth showing up for.</Text>
      </View>

      <View style={styles.group}>
        <FieldLabel label={`Check all five · ${count} of 5`} required />
        <Card style={styles.list}>
          {COACH_GUIDELINES.map((g, i) => (
            <ListRow key={g} divider={i > 0} checked={checked[i]} accessibilityLabel={g} onPress={() => toggle(i)}>
              <View style={[styles.box, checked[i] && styles.boxOn]}>
                {checked[i] ? <Icon name="check" size={16} color={colors.onGold} strokeWidth={2.8} /> : null}
              </View>
              <Text variant="bodyStrong" style={styles.flex}>
                {g}
              </Text>
            </ListRow>
          ))}
        </Card>
      </View>

      {error ? (
        <Text variant="caption" color={statusColors.bad}>
          {error}
        </Text>
      ) : null}
      <Button label={saving ? 'Saving…' : all ? 'I agree' : 'Check all five to continue'} height={52} disabled={!all || saving} onPress={next} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  box: {
    width: 26,
    height: 26,
    borderRadius: radius.xs,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.gold },
});
