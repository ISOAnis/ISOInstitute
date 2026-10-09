import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button, Chip, Field, FieldLabel, Screen, Text, TopBar } from '@/components';
import { checkCoachExtras, getCoachExtras, HEARD_FROM_OPTIONS, useData, type CoachExtras } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { useApplyContinue } from '@/features/apply/steps';
import { useAppStore } from '@/store';
import { colors, statusColors } from '@/theme';

/** Step 9: LinkedIn, who invited them, and how they heard about ISO. All optional. */
export default function ApplyExtras() {
  const { data: saved, loading } = useData(getCoachExtras, []);
  const saveCoachExtras = useAppStore((s) => s.saveCoachExtras);
  const goNext = useApplyContinue('review');

  const [form, setForm] = useState<CoachExtras | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !form) setForm(saved ?? {});
  }, [loading, saved, form]);

  if (!form) return <Screen>{null}</Screen>;

  const set = (patch: Partial<CoachExtras>) => {
    setForm({ ...form, ...patch });
    setError('');
  };

  const save = async (input: CoachExtras) => {
    const problem = checkCoachExtras(input);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      await saveCoachExtras(input);
      goNext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const empty = !form.linkedIn?.trim() && !form.invitedBy?.trim() && !form.heardFrom;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar onBack={() => router.back()} />
        <ApplyProgress step="extras" />

        <View style={styles.group}>
          <Text variant="titleLg">Almost done</Text>
          <Text variant="subtitle">A few optional extras. Skip any of them.</Text>
        </View>

        <View style={styles.fields}>
          <View style={styles.group}>
            <FieldLabel label="LinkedIn" optional />
            <Field
              value={form.linkedIn ?? ''}
              onChangeText={(linkedIn) => set({ linkedIn })}
              placeholder="linkedin.com/in/yourname"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="LinkedIn"
            />
          </View>

          <View style={styles.group}>
            <FieldLabel label="Who invited you?" optional />
            <Field
              value={form.invitedBy ?? ''}
              onChangeText={(invitedBy) => set({ invitedBy })}
              placeholder="Their name"
              autoCapitalize="words"
              accessibilityLabel="Who invited you?"
            />
            <Text variant="caption">If one of our First Believers sent you, add their name so we can thank them.</Text>
          </View>

          <View style={styles.group}>
            <FieldLabel label="How did you hear about ISO?" optional />
            <View style={styles.chips}>
              {HEARD_FROM_OPTIONS.map((o) => (
                <Chip key={o} label={o} active={form.heardFrom === o} onPress={() => set({ heardFrom: form.heardFrom === o ? undefined : o })} />
              ))}
            </View>
          </View>
        </View>

        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button label={saving ? 'Saving…' : empty ? 'Skip' : 'Continue'} height={52} disabled={saving} onPress={() => save(form)} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  group: { gap: 12 },
  fields: { gap: 24 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
