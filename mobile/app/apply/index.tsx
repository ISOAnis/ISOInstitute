import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Icon, Screen, Text, TopBar } from '@/components';
import { COACH_APPLY_STEPS, getCoachDraft, getCoachResumeStep, useData } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { applyStepHref } from '@/features/apply/steps';
import { useAppStore } from '@/store';
import { colors, fonts } from '@/theme';

/** Coach application intro: what it takes, what we'll ask, and a way back in if they left mid-way. */
export default function ApplyIntro() {
  const revision = useAppStore((s) => s.revision);
  const draft = useData(getCoachDraft, [revision]).data;
  const resume = useData(getCoachResumeStep, [revision]).data;
  const saved = draft?.saved ?? [];

  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      <ApplyProgress />

      <View style={styles.group}>
        <Text variant="titleLg">Apply to coach</Text>
        <Text variant="subtitle">This takes about 10 minutes. Have your government ID ready.</Text>
      </View>

      <Card style={styles.list}>
        <Text variant="section">What we’ll ask</Text>
        {COACH_APPLY_STEPS.map((s, i) => {
          const done = saved.includes(s.id);
          return (
            <View key={s.id} style={styles.step}>
              <View style={[styles.num, done && styles.numDone]}>
                {done ? (
                  <Icon name="check" size={14} color={colors.onGold} strokeWidth={2.8} />
                ) : (
                  <Text style={styles.numText} color={colors.textSecondary}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text variant="body" color={done ? colors.textSecondary : colors.text} style={styles.flex}>
                {s.title}
              </Text>
            </View>
          );
        })}
      </Card>

      <View style={styles.note}>
        <Icon name="idCard" size={20} color={colors.gold} />
        <Text variant="caption" style={styles.flex}>
          Step 8 checks your ID with a photo and a quick selfie. ISO never keeps a copy of your ID.
        </Text>
      </View>

      <View style={styles.group}>
        {draft?.submittedAt ? (
          <Button label="See your application" height={52} onPress={() => router.push('/coach-review')} />
        ) : (
          <Button label={resume ? 'Pick up where you left off' : 'Start'} height={52} onPress={() => router.push(applyStepHref(resume ?? 'basics'))} />
        )}
        <Text variant="caption" align="center">
          Your answers save every time you tap Continue.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1 },
  list: { gap: 12 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surface3, alignItems: 'center', justifyContent: 'center' },
  numDone: { backgroundColor: colors.gold },
  numText: { fontFamily: fonts.bold, fontSize: 13 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
