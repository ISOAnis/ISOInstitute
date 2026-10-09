import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button, FieldLabel, Screen, Text, TopBar } from '@/components';
import { checkCoachTopics, getCoachTopics, useData } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { useApplyContinue } from '@/features/apply/steps';
import { TagPicker } from '@/features/TagPicker';
import { useAppStore } from '@/store';
import { colors, statusColors } from '@/theme';

/** Step 5: up to 5 things they're open to talking about. Pathway tags and General first. */
export default function ApplyTopics() {
  const saved = useData(getCoachTopics, []).data;
  const saveCoachTopics = useAppStore((s) => s.saveCoachTopics);
  const goNext = useApplyContinue('hosting');

  const [topics, setTopics] = useState<string[] | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (saved && !topics) setTopics(saved.topics);
  }, [saved, topics]);

  if (!saved || !topics) return <Screen>{null}</Screen>;

  const next = async () => {
    const problem = checkCoachTopics(topics);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      await saveCoachTopics(topics);
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
        <ApplyProgress step="topics" />

        <View style={styles.group}>
          <Text variant="titleLg">What you’re open to talking about</Text>
          <Text variant="subtitle">Players pick the same tags, so this is how they find you. These show on your coach card.</Text>
        </View>

        <View style={styles.group}>
          <FieldLabel label="Pick up to 5" required />
          <TagPicker
            selected={topics}
            pathway={saved.pathway}
            onChange={(t) => {
              setTopics(t);
              setError('');
            }}
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
  group: { gap: 12 },
});
