import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, Text } from '@/components';
import { OnboardingHeader } from '@/features/OnboardingHeader';
import { useAppStore } from '@/store';
import { colors, fonts, gutter, pathwayColors } from '@/theme';

const QUESTIONS: [string, string[]][] = [
  ['At a table, you are usually…', ['The listener', 'The question asker', 'The storyteller']],
  ['You learn best from…', ['Real stories', 'Straight feedback', 'Working a problem']],
  ['Where you are right now', ['In school', 'Early career', 'Switching paths', 'Starting something']],
];

/** Onboard3: three skippable questions used for matching. */
export default function QuestionsStep() {
  const insets = useSafeAreaInsets();
  const pathway = useAppStore((s) => s.pathway);
  const saveAnswers = useAppStore((s) => s.saveAnswers);
  const [answers, setAnswers] = useState<string[]>(['The question asker', 'Straight feedback', 'Early career']);
  const accent = pathwayColors[pathway];

  const next = async (save: boolean) => {
    if (save) await saveAnswers(answers);
    router.push('/onboarding/talk');
  };

  return (
    <View style={styles.root}>
      <OnboardingHeader step={3} accent={accent.fill} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable accessibilityRole="button" onPress={() => next(false)} style={styles.skip} hitSlop={8}>
          <Text style={styles.skipText} color={colors.textSecondary}>
            Skip for now
          </Text>
        </Pressable>
        <Text variant="titleLg">Three quick ones</Text>
        <Text variant="subtitle">So we can match you with coaches and tables that fit how you show up.</Text>

        {QUESTIONS.map(([q, options], i) => (
          <View key={q} style={styles.question}>
            <Text variant="bodyStrong">{q}</Text>
            <View style={styles.options}>
              {options.map((o) => (
                <Chip key={o} label={o} active={answers[i] === o} onPress={() => setAnswers((a) => a.map((v, j) => (j === i ? o : v)))} />
              ))}
            </View>
          </View>
        ))}

        <Button label="Continue" height={52} onPress={() => next(true)} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: gutter, gap: 16 },
  skip: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center' },
  skipText: { fontFamily: fonts.bold, fontSize: 14 },
  question: { gap: 12, marginTop: 12 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
