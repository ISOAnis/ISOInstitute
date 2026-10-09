import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, Field, FieldLabel, Icon, Screen, Text, TopBar } from '@/components';
import { checkCoachPath, getCoachPath, getCohortInfo, getPathways, useData, type CoachPath } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { useApplyContinue } from '@/features/apply/steps';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, pathwayColors, radius, statusColors } from '@/theme';

/** Step 2: the pathway they'll coach, plus current role and organization. All required. */
export default function ApplyPath() {
  const saved = useData(getCoachPath, []).data;
  const pathways = useData(getPathways, []).data ?? [];
  const cohort = useData(getCohortInfo, []).data;
  const saveCoachPath = useAppStore((s) => s.saveCoachPath);
  const goNext = useApplyContinue('experience');

  const [form, setForm] = useState<CoachPath | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (saved && !form) setForm(saved);
  }, [saved, form]);

  if (!form) return <Screen>{null}</Screen>;

  const set = (patch: Partial<CoachPath>) => {
    setForm({ ...form, ...patch });
    setError('');
  };

  const left = form.pathway && cohort ? cohort.spotsLeft[form.pathway] : undefined;

  const next = async () => {
    const problem = checkCoachPath(form);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      await saveCoachPath(form);
      goNext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar onBack={() => router.back()} />
        <ApplyProgress step="path" />

        <View style={styles.group}>
          <Text variant="titleLg">Your path</Text>
          <Text variant="subtitle">The pathway you’ll coach, and what you do now.</Text>
        </View>

        <View style={styles.group}>
          <FieldLabel label="Pathway" required />
          <Text variant="caption">You can’t change this after you’re approved.</Text>
          <View style={styles.list}>
            {pathways.map((path) => {
              const c = pathwayColors[path.id];
              const active = form.pathway === path.id;
              return (
                <Pressable
                  key={path.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${path.name}, ${path.field}`}
                  onPress={() => set({ pathway: path.id })}
                  style={[styles.row, active ? { backgroundColor: alpha(c.fill, 0.12) } : styles.rowIdle]}
                >
                  <View style={[styles.mark, { backgroundColor: alpha(c.fill, active ? 0.22 : 0.12) }]}>
                    <Icon name={path.id} size={24} color={c.text} />
                  </View>
                  <View style={styles.flex}>
                    <Text variant="cardTitle" color={active ? c.text : colors.text}>
                      {path.name}
                    </Text>
                    <Text variant="caption" color={active ? colors.text : colors.textSecondary}>
                      {path.field}
                    </Text>
                  </View>
                  {active ? <Icon name="check" size={20} color={c.text} /> : null}
                </Pressable>
              );
            })}
          </View>
          {form.pathway && cohort && left !== undefined ? (
            left === 0 ? (
              <View style={styles.full}>
                <Text variant="bodyStrong" color={statusColors.bad}>
                  {pathwayName(form.pathway)} is full this cohort
                </Text>
                <Text variant="caption">You can still apply. The board reviews you and you hold a place in line for the next open spot.</Text>
              </View>
            ) : (
              <Text variant="caption" style={styles.spots} color={colors.text}>
                {cohort.name}: {left} of {cohort.spotsPerPathway} {pathwayName(form.pathway)} spots left
              </Text>
            )
          ) : null}
        </View>

        <View style={styles.fields}>
          <Field
            label="Current role or title"
            required
            value={form.role}
            onChangeText={(role) => set({ role })}
            placeholder="Owner, ER nurse, software engineer"
            autoCapitalize="words"
            autoComplete="organization-title"
            textContentType="jobTitle"
          />
          <Field
            label="Organization"
            required
            value={form.organization}
            onChangeText={(organization) => set({ organization })}
            placeholder="Company, school, or Self-employed"
            autoCapitalize="words"
            autoComplete="organization"
            textContentType="organizationName"
          />
        </View>

        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button label={saving ? 'Saving…' : 'Continue'} height={52} disabled={saving} onPress={next} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1, gap: 2 },
  group: { gap: 12 },
  fields: { gap: 16 },
  list: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18, borderRadius: radius.card },
  rowIdle: { backgroundColor: colors.surface1 },
  mark: { width: 46, height: 46, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  spots: { fontFamily: fonts.semibold },
  full: { gap: 2, padding: 12, borderRadius: radius.lg, backgroundColor: alpha(statusColors.bad, 0.1) },
});
