import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button, Card, Field, FieldLabel, Screen, Text, Toggle, TopBar } from '@/components';
import { checkCoachWhy, getCoachWhy, MAX_CARD_LINE, useData, type CoachWhy } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { OptionalSection } from '@/features/apply/OptionalSection';
import { useApplyContinue } from '@/features/apply/steps';
import { useAppStore } from '@/store';
import { colors, statusColors } from '@/theme';

const blank: CoachWhy = { motivation: '', helpedBy: '', wishKnewAt20: '', showCardLine: false, cardLine: '' };

/** Step 4: why they coach. Motivation is required; the rest is optional. Only the card line is ever public. */
export default function ApplyWhy() {
  const { data: saved, loading } = useData(getCoachWhy, []);
  const saveCoachWhy = useAppStore((s) => s.saveCoachWhy);
  const goNext = useApplyContinue('topics');

  const [form, setForm] = useState<CoachWhy | null>(null);
  const [helpedOn, setHelpedOn] = useState(true);
  const [wishOn, setWishOn] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || form) return;
    setForm(saved ?? blank);
    if (saved) {
      setHelpedOn(saved.helpedBy !== undefined);
      setWishOn(saved.wishKnewAt20 !== undefined);
    }
  }, [loading, saved, form]);

  if (!form) return <Screen>{null}</Screen>;

  const set = (patch: Partial<CoachWhy>) => {
    setForm({ ...form, ...patch });
    setError('');
  };

  const next = async () => {
    const input: CoachWhy = { ...form, helpedBy: helpedOn ? form.helpedBy : undefined, wishKnewAt20: wishOn ? form.wishKnewAt20 : undefined };
    const problem = checkCoachWhy(input);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      await saveCoachWhy(input);
      goNext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const lineLeft = MAX_CARD_LINE - form.cardLine.length;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar onBack={() => router.back()} />
        <ApplyProgress step="why" />

        <View style={styles.group}>
          <Text variant="titleLg">Why you coach</Text>
          <Text variant="subtitle">This is for the board, in your own words. Nothing here goes on your card unless you turn it on below.</Text>
        </View>

        <View style={styles.group}>
          <FieldLabel label="What’s your motivation for giving back?" required />
          <Field
            value={form.motivation}
            onChangeText={(motivation) => set({ motivation })}
            placeholder="A few sentences is plenty."
            multiline
            accessibilityLabel="What’s your motivation for giving back?"
            style={styles.long}
          />
        </View>

        <OptionalSection label="Who helped you get where you are, or who do you wish had?" on={helpedOn} onChange={setHelpedOn} skippedNote="Skipped.">
          <Field
            value={form.helpedBy ?? ''}
            onChangeText={(helpedBy) => set({ helpedBy })}
            placeholder="A teacher, a cousin, a boss, nobody yet."
            multiline
            accessibilityLabel="Who helped you get where you are, or who do you wish had?"
          />
        </OptionalSection>

        <OptionalSection label="What do you wish you knew at 20?" on={wishOn} onChange={setWishOn} skippedNote="Skipped.">
          <Field
            value={form.wishKnewAt20 ?? ''}
            onChangeText={(wishKnewAt20) => set({ wishKnewAt20 })}
            placeholder="The thing you’d tell yourself."
            multiline
            accessibilityLabel="What do you wish you knew at 20?"
          />
        </OptionalSection>

        <Card style={styles.card}>
          <Toggle
            title="Show a one-line “Why I coach” on my coach card"
            subtitle="Players see it when they flip your card."
            value={form.showCardLine}
            onChange={(showCardLine) => set({ showCardLine })}
          />
          {form.showCardLine ? (
            <View style={styles.line}>
              <Field
                value={form.cardLine}
                onChangeText={(cardLine) => set({ cardLine: cardLine.replace(/\n/g, ' ') })}
                placeholder="Nobody showed me the way in. I’m the shortcut."
                maxLength={MAX_CARD_LINE}
                returnKeyType="done"
                accessibilityLabel="Your one line"
              />
              <Text variant="caption" align="right" color={lineLeft < 10 ? colors.gold : colors.textMeta}>
                {lineLeft} left
              </Text>
            </View>
          ) : null}
        </Card>

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
  group: { gap: 12 },
  long: { minHeight: 140 },
  card: { gap: 8 },
  line: { gap: 6 },
});
