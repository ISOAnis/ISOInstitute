import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Icon, ListRow, Screen, Text } from '@/components';
import { getMe, useData } from '@/data';
import { clockTime, dayLabel } from '@/lib/format';
import { useAppStore } from '@/store';
import { colors } from '@/theme';

export default function CoachReview() {
  const me = useData(getMe, []).data;
  const { approveCoachDemo, completeOnboarding, setMode } = useAppStore.getState();
  const submitted = me?.appliedAt ? `${dayLabel(me.appliedAt)}, ${clockTime(me.appliedAt)}` : 'Just now';

  const steps = [
    { title: 'Submitted', sub: submitted, state: 'done' as const },
    { title: 'Advisory board review', sub: 'Experience, story, and fit with the ISO Standard', state: 'current' as const },
    { title: 'Approved: your coach card goes live', sub: 'Start at Bronze. Every ISO moves your Overall.', state: 'todo' as const },
  ];

  const explore = () => {
    completeOnboarding();
    router.replace('/map');
  };

  const approveNow = async () => {
    await approveCoachDemo();
    completeOnboarding();
    setMode('coach');
    router.replace('/manage');
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text variant="titleLg">Application in</Text>
        <Text variant="subtitle">The ISO advisory board reviews every coach. You’ll hear back within 24–48 hours.</Text>
      </View>

      <Card>
        {steps.map((s, i) => (
          <View key={s.title} style={styles.step}>
            <View style={styles.rail}>
              <View style={[styles.dot, s.state === 'done' && styles.dotDone, s.state === 'current' && styles.dotCurrent]}>
                {s.state === 'done' ? <Icon name="check" size={14} color={colors.bg} strokeWidth={2.6} /> : null}
              </View>
              {i < steps.length - 1 ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.stepBody}>
              <Text variant="bodyStrong" color={s.state === 'todo' ? colors.textSecondary : colors.text}>
                {s.title}
              </Text>
              <Text variant="caption">{s.sub}</Text>
            </View>
          </View>
        ))}
      </Card>

      <View style={styles.group}>
        <Text variant="section">While you wait</Text>
        <Card style={styles.list}>
          <ListRow>
            <View style={styles.flex}>
              <Text variant="bodyStrong">Draft your first ISO</Text>
              <Text variant="caption">It goes live the moment you’re approved</Text>
            </View>
          </ListRow>
          <ListRow divider onPress={explore} accessibilityLabel="Browse ISOs on the map">
            <View style={styles.flex}>
              <Text variant="bodyStrong">See how other coaches run it</Text>
              <Text variant="caption">Browse ISOs on the map</Text>
            </View>
            <Icon name="forward" size={18} color={colors.textSecondary} />
          </ListRow>
        </Card>
      </View>

      <Button label="Explore ISO" height={52} onPress={explore} />

      <Card>
        <Text variant="section">Prototype</Text>
        <Text variant="caption">Skip the review and sign in to the coach side as Marcus Reid, the demo coach account.</Text>
        <Button label="Approve me now" variant="outline" height={44} onPress={approveNow} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 6, marginTop: 24 },
  flex: { flex: 1, gap: 2 },
  group: { gap: 12 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  step: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.surface3, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.text, borderColor: colors.text },
  dotCurrent: { borderColor: colors.text },
  line: { flex: 1, width: 2, backgroundColor: colors.surface3, marginVertical: 4 },
  stepBody: { flex: 1, gap: 2, paddingBottom: 18 },
});
