import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components';
import { useAppStore } from '@/store';
import { colors, fonts, gutter, pathwayColors } from '@/theme';

const STEPS = [
  {
    title: 'Find an ISO',
    body: 'A small, in-person session with a coach who’s already walked your path. Pick one near you on the map.',
    say: '“There’s a Founder ISO in Aurora Tuesday.”',
  },
  {
    title: 'Say “I got next”',
    body: 'Claim your seat. Once the coach confirms, you get the exact spot and your check-in code.',
    say: '“I got next at Marcus’s ISO.”',
  },
  {
    title: 'Pull up, check in',
    body: 'Show up, find the table, and give the coach your 4-digit code.',
    say: '“Code’s 4827, coach.”',
  },
  {
    title: 'Rank up',
    body: 'Every ISO in your pathway counts. Rank up to unlock gear in The Locker and nights on The Court.',
    say: '“Just hit Varsity. Patch is in my Locker.”',
  },
];

/** SpeakISO: the four-step rundown, then into the map on Recommended. */
export default function TalkTheTalk() {
  const insets = useSafeAreaInsets();
  const pathway = useAppStore((s) => s.pathway);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const accent = pathwayColors[pathway];

  const jumpIn = () => {
    completeOnboarding();
    router.replace({ pathname: '/map', params: { pill: 'recommended' } });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
      <Text variant="eyebrow">The quick rundown</Text>
      <Text variant="titleLg">Talk the ISO talk</Text>
      <Text variant="subtitle">Four steps. That’s the whole game.</Text>

      <View style={styles.steps}>
        {STEPS.map((s, i) => (
          <View key={s.title} style={styles.step}>
            <View style={styles.rail}>
              <View style={[styles.num, { borderColor: accent.fill }]}>
                <Text style={styles.numText} color={accent.text}>
                  {i + 1}
                </Text>
              </View>
              {i < STEPS.length - 1 ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.stepBody}>
              <Text variant="cardTitle">{s.title}</Text>
              <Text variant="body" color={colors.textSecondary}>
                {s.body}
              </Text>
              <Text variant="body" style={styles.say}>
                {s.say}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.noteRow}>
        <Text variant="caption" style={styles.flex}>
          The rest of the lingo lives in the Playbook, under Settings.
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Open the Playbook" onPress={() => router.push('/playbook')} hitSlop={10}>
          <Text style={styles.open}>Open</Text>
        </Pressable>
      </View>

      <Button label="It’s not you vs you anymore. Jump In." height={56} onPress={jumpIn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: gutter, gap: 16 },
  flex: { flex: 1 },
  steps: { marginTop: 8 },
  step: { flexDirection: 'row', gap: 14 },
  rail: { alignItems: 'center', width: 36 },
  num: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.bold, fontSize: 15 },
  line: { flex: 1, width: 2, backgroundColor: colors.hairline, marginVertical: 4 },
  stepBody: { flex: 1, gap: 6, paddingBottom: 28 },
  say: { fontFamily: fonts.semibold, color: colors.text },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  open: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, textDecorationLine: 'underline' },
});
