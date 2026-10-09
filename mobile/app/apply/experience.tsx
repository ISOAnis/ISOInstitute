import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Field, FieldLabel, Screen, Text, TopBar } from '@/components';
import { checkCoachBackground, getCoachBackground, getCoachSkillSuggestions, MAX_EXPERIENCE, MAX_SKILLS, useData, type CoachBackground } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { OptionalSection } from '@/features/apply/OptionalSection';
import { useApplyContinue } from '@/features/apply/steps';
import { useAppStore } from '@/store';
import { colors, fonts, statusColors } from '@/theme';

type Entry = { role: string; organization: string; years: string };

const blankEntry = (): Entry => ({ role: '', organization: '', years: '' });

/** Step 3: up to 3 roles, optional education, and up to 8 skills. Feeds the back of the coach card. */
export default function ApplyExperience() {
  const saved = useData(getCoachBackground, []).data;
  const suggestions = useData(getCoachSkillSuggestions, []).data ?? [];
  const saveCoachBackground = useAppStore((s) => s.saveCoachBackground);
  const goNext = useApplyContinue('why');

  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [eduOn, setEduOn] = useState(true);
  const [school, setSchool] = useState('');
  const [field, setField] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!saved || entries) return;
    setEntries(saved.experience.length ? saved.experience.map((e) => ({ ...e, years: e.years ? String(e.years) : '' })) : [blankEntry()]);
    // A saved step always has skills, so no skills means this is the first visit.
    setEduOn(!!saved.education || !saved.skills.length);
    setSchool(saved.education?.school ?? '');
    setField(saved.education?.field ?? '');
    setSkills(saved.skills);
  }, [saved, entries]);

  if (!entries) return <Screen>{null}</Screen>;

  const edit = (i: number, patch: Partial<Entry>) => {
    setEntries(entries.map((e, j) => (j === i ? { ...e, ...patch } : e)));
    setError('');
  };

  const toggleSkill = (s: string) => {
    setError('');
    if (skills.includes(s)) return setSkills(skills.filter((k) => k !== s));
    if (skills.length < MAX_SKILLS) setSkills([...skills, s]);
  };

  const addCustom = () => {
    const s = custom.trim();
    if (!s) return;
    if (!skills.some((k) => k.toLowerCase() === s.toLowerCase()) && skills.length < MAX_SKILLS) setSkills([...skills, s]);
    setCustom('');
  };

  const form = (): CoachBackground => ({
    experience: entries.map((e) => ({ role: e.role, organization: e.organization, years: Number(e.years) })),
    education: eduOn && (school.trim() || field.trim()) ? { school, field } : undefined,
    skills,
  });

  const next = async () => {
    const input = form();
    const problem = checkCoachBackground(input);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      await saveCoachBackground(input);
      goNext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const chips = [...suggestions, ...skills.filter((s) => !suggestions.includes(s))];
  const full = skills.length >= MAX_SKILLS;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar onBack={() => router.back()} />
        <ApplyProgress step="experience" />

        <View style={styles.group}>
          <Text variant="titleLg">Your experience</Text>
          <Text variant="subtitle">This goes on the back of your coach card, so players know where you’ve been.</Text>
        </View>

        <View style={styles.group}>
          <FieldLabel label="Experience" required />
          <Text variant="caption">Up to {MAX_EXPERIENCE} roles. Start with the one that matters most for your pathway.</Text>
          {entries.map((e, i) => (
            <Card key={i} style={styles.entry}>
              <View style={styles.entryHead}>
                <Text variant="bodyStrong">Role {i + 1}</Text>
                {entries.length > 1 ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove role ${i + 1}`}
                    onPress={() => setEntries(entries.filter((_, j) => j !== i))}
                    style={styles.textBtn}
                  >
                    <Text style={styles.textBtnLabel} color={colors.textSecondary}>
                      Remove
                    </Text>
                  </Pressable>
                ) : null}
              </View>
              <Field
                label="Role"
                value={e.role}
                onChangeText={(role) => edit(i, { role })}
                placeholder="Charge nurse"
                autoCapitalize="words"
                textContentType="jobTitle"
              />
              <Field
                label="Organization"
                value={e.organization}
                onChangeText={(organization) => edit(i, { organization })}
                placeholder="Denver Health"
                autoCapitalize="words"
                textContentType="organizationName"
              />
              <Field
                label="Years"
                value={e.years}
                onChangeText={(years) => edit(i, { years: years.replace(/\D/g, '').slice(0, 2) })}
                placeholder="4"
                keyboardType="number-pad"
                maxLength={2}
                style={styles.years}
              />
            </Card>
          ))}
          {entries.length < MAX_EXPERIENCE ? (
            <Button label="Add another role" variant="outline" icon="plus" height={48} onPress={() => setEntries([...entries, blankEntry()])} />
          ) : null}
        </View>

        <OptionalSection
          label="Education"
          on={eduOn}
          onChange={(on) => {
            setEduOn(on);
            setError('');
          }}
          skippedNote="Skipped. Your card won’t show education."
        >
          <Field label="School" value={school} onChangeText={setSchool} placeholder="University of Colorado" autoCapitalize="words" />
          <Field label="Field of study" value={field} onChangeText={setField} placeholder="Nursing" autoCapitalize="words" />
        </OptionalSection>

        <View style={styles.group}>
          <FieldLabel
            label="Skills"
            right={
              <Text variant="caption" color={full ? colors.gold : colors.textMeta}>
                {skills.length} of {MAX_SKILLS} · Required
              </Text>
            }
          />
          <Text variant="caption">Tap to pick. Add your own if it isn’t here.</Text>
          <View style={styles.chips}>
            {chips.map((s) => (
              <Chip key={s} label={s} active={skills.includes(s)} onPress={() => toggleSkill(s)} />
            ))}
          </View>
          <View style={styles.addRow}>
            <View style={styles.flex}>
              <Field
                value={custom}
                onChangeText={setCustom}
                placeholder={full ? `${MAX_SKILLS} picked. Remove one to add.` : 'Add a skill'}
                editable={!full}
                onSubmitEditing={addCustom}
                returnKeyType="done"
              />
            </View>
            <Button label="Add" variant="outline" height={50} disabled={full || !custom.trim()} onPress={addCustom} />
          </View>
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
  flex: { flex: 1 },
  group: { gap: 12 },
  entry: { gap: 14 },
  entryHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  years: { width: 96 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  textBtn: { minHeight: 44, justifyContent: 'center' },
  textBtnLabel: { fontFamily: fonts.bold, fontSize: 15 },
});
