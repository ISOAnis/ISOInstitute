import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Field, Icon, Screen, Text, TopBar } from '@/components';
import { getCohortInfo, getPathways, useData, type PathwayId } from '@/data';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, radius, statusColors } from '@/theme';

const BOARD_LOOKS_FOR = [
  { title: 'Real experience in your pathway', sub: 'You’ve done the thing, not just studied it.' },
  { title: 'Rooted in the city', sub: 'You live here and know the neighborhoods you’d host in.' },
  { title: 'Here to serve, not to sell', sub: 'No pitches, no funnels, no recruiting.' },
  { title: 'Lives the ISO Standard', sub: 'Discipline, humility, and respect at every ISO.' },
];

const STANDARD_RULES = [
  'ISO coaches serve, they don’t perform.',
  'ISOs stay on your pathway: careers, skills, and the real journey.',
  'No ISO is used to promote any political, social, or personal agenda.',
  'Every player who shows up gets the same respect.',
];

export default function CoachApply() {
  const applyToCoach = useAppStore((s) => s.applyToCoach);
  const pathways = useData(getPathways, []).data ?? [];
  const cohort = useData(getCohortInfo, []).data;
  const [pathway, setPathway] = useState<PathwayId>('founder');
  const [currentRole, setCurrentRole] = useState('');
  const [story, setStory] = useState('');
  const [hostArea, setHostArea] = useState('');
  const [link, setLink] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const left = cohort?.spotsLeft[pathway];
  const full = left === 0;

  const submit = async () => {
    if (!currentRole.trim() || !story.trim()) return setError('Tell us what you do now and how you got here.');
    await applyToCoach({ pathway, currentRole, story, hostArea, link });
    router.replace(full ? '/coach-decision?outcome=next' : '/coach-review');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar
          right={
            <Text variant="caption" color={colors.textSecondary}>
              Reviewed in 24–48 hrs
            </Text>
          }
        />
        <View style={styles.group}>
          <Text variant="eyebrow">Coach application</Text>
          <Text variant="titleLg">Pull as you climb</Text>
          <Text variant="subtitle">Every ISO coach is approved by our advisory board. Tell us where you’ve been.</Text>
        </View>

        <Card>
          <Text variant="section">What the board looks for</Text>
          {BOARD_LOOKS_FOR.map((b) => (
            <View key={b.title} style={styles.look}>
              <Icon name="check" size={18} color={colors.gold} strokeWidth={2.6} />
              <View style={styles.flexGap}>
                <Text variant="bodyStrong">{b.title}</Text>
                <Text variant="caption">{b.sub}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.group}>
          <Text variant="section">Your pathway</Text>
          <View style={styles.chips}>
            {pathways.map((p) => (
              <Chip key={p.id} label={p.name} pathway={p.id} active={pathway === p.id} onPress={() => setPathway(p.id)} />
            ))}
          </View>
          {cohort && left !== undefined ? (
            full ? (
              <View style={styles.spotsFull}>
                <Text variant="bodyStrong" color={statusColors.bad}>
                  {pathwayName(pathway)} is full this cohort
                </Text>
                <Text variant="caption">Join the waitlist and the board still reviews you. You’ll hold a place in line for the next open spot.</Text>
              </View>
            ) : (
              <Text variant="caption" style={styles.spots} color={colors.text}>
                {cohort.name}: {left} of {cohort.spotsPerPathway} {pathwayName(pathway)} spots left
              </Text>
            )
          ) : null}
        </View>

        <View style={styles.fields}>
          <Field label="What do you do now?" value={currentRole} onChangeText={setCurrentRole} placeholder="Coffee shop owner, two locations" />
          <Field label="How did you get here? A few lines." value={story} onChangeText={setStory} multiline />
          <Field label="Where would you host ISOs?" value={hostArea} onChangeText={setHostArea} placeholder="Aurora, Glendale" />
          <Field label="LinkedIn or a link to your work" value={link} onChangeText={setLink} autoCapitalize="none" keyboardType="url" />
        </View>

        <Card>
          <Text variant="section">The ISO standard</Text>
          <Text variant="cardTitle">Discipline · Humility · Respect</Text>
          {STANDARD_RULES.map((r) => (
            <View key={r} style={styles.rule}>
              <View style={styles.ruleDot} />
              <Text variant="body" style={styles.flex}>
                {r}
              </Text>
            </View>
          ))}
        </Card>

        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agreed }} onPress={() => setAgreed(!agreed)} style={styles.agree}>
          <View style={[styles.box, agreed && styles.boxOn]}>{agreed ? <Icon name="check" size={16} color={colors.bg} strokeWidth={2.6} /> : null}</View>
          <Text variant="bodyStrong">I’ll coach by the ISO Standard</Text>
        </Pressable>

        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button
          label={!agreed ? 'Agree to the ISO Standard to submit' : full ? 'Join the waitlist' : 'Submit for review'}
          height={52}
          disabled={!agreed}
          onPress={submit}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  flexGap: { flex: 1, gap: 2 },
  look: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  spots: { fontFamily: fonts.semibold },
  spotsFull: { gap: 2, padding: 12, borderRadius: radius.lg, backgroundColor: alpha(statusColors.bad, 0.1) },
  group: { gap: 12 },
  fields: { gap: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rule: { flexDirection: 'row', gap: 10 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textSecondary, marginTop: 9 },
  agree: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  box: {
    width: 26,
    height: 26,
    borderRadius: radius.xs,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.text },
});
