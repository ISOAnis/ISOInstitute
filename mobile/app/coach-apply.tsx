import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Field, Icon, Screen, Text, TopBar } from '@/components';
import { getPathways, useData, type PathwayId } from '@/data';
import { useAppStore } from '@/store';
import { colors, fonts, pathwayColors, radius, statusColors, tracking } from '@/theme';

const STANDARD_RULES = [
  'ISO coaches serve, they don’t perform.',
  'ISOs stay on your pathway: careers, skills, and the real journey.',
  'No ISO is used to promote any political, social, or personal agenda.',
  'Every player who shows up gets the same respect.',
];

export default function CoachApply() {
  const applyToCoach = useAppStore((s) => s.applyToCoach);
  const pathways = useData(getPathways, []).data ?? [];
  const [pathway, setPathway] = useState<PathwayId>('founder');
  const [currentRole, setCurrentRole] = useState('');
  const [story, setStory] = useState('');
  const [hostArea, setHostArea] = useState('');
  const [link, setLink] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!currentRole.trim() || !story.trim()) return setError('Tell us what you do now and how you got here.');
    await applyToCoach({ pathway, currentRole, story, hostArea, link });
    router.replace('/coach-review');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar
          right={
            <Text variant="tiny" color={colors.textMuted}>
              Reviewed in 24–48 hrs
            </Text>
          }
        />
        <Text variant="eyebrow" color={colors.gold}>
          COACH APPLICATION
        </Text>
        <Text variant="titleLg">Pull as you climb</Text>
        <Text variant="subtitle">Every ISO coach is approved by our advisory board. Tell us where you’ve been.</Text>

        <Text variant="section">YOUR PATHWAY</Text>
        <View style={styles.chips}>
          {pathways.map((p) => (
            <Chip
              key={p.id}
              label={p.name}
              active={pathway === p.id}
              activeColor={pathwayColors[p.id].fill}
              activeInk={pathwayColors[p.id].ink}
              onPress={() => setPathway(p.id)}
            />
          ))}
        </View>

        <Field label="What do you do now?" value={currentRole} onChangeText={setCurrentRole} placeholder="Coffee shop owner, two locations" />
        <Field label="How did you get here? A few lines." value={story} onChangeText={setStory} multiline />
        <Field label="Where would you host ISOs?" value={hostArea} onChangeText={setHostArea} placeholder="Aurora, Glendale" />
        <Field label="LinkedIn or a link to your work" value={link} onChangeText={setLink} autoCapitalize="none" keyboardType="url" />

        <Card style={{ borderColor: statusColors.goldLine }}>
          <Text variant="eyebrow" color={colors.gold}>
            THE ISO STANDARD
          </Text>
          <View style={styles.values}>
            {['DISCIPLINE', 'HUMILITY', 'RESPECT'].map((v) => (
              <Text key={v} style={styles.value}>
                {v}
              </Text>
            ))}
          </View>
          {STANDARD_RULES.map((r) => (
            <View key={r} style={styles.rule}>
              <View style={styles.ruleDot} />
              <Text variant="caption" color={colors.textBody} style={styles.flex}>
                {r}
              </Text>
            </View>
          ))}
        </Card>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          onPress={() => setAgreed(!agreed)}
          style={styles.agree}
        >
          <View style={[styles.box, agreed && styles.boxOn]}>{agreed ? <Icon name="check" size={16} color={colors.onGold} /> : null}</View>
          <Text variant="bodyStrong">I’ll coach by the ISO Standard</Text>
        </Pressable>

        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button label={agreed ? 'Submit for review' : 'Agree to the ISO Standard to submit'} height={52} disabled={!agreed} onPress={submit} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  values: { flexDirection: 'row', gap: 14 },
  value: { fontFamily: fonts.display, fontSize: 22, letterSpacing: tracking(0.04, 22), color: colors.text },
  rule: { flexDirection: 'row', gap: 8 },
  ruleDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.gold, marginTop: 7 },
  agree: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  box: {
    width: 26,
    height: 26,
    borderRadius: radius.tag + 1,
    borderWidth: 2,
    borderColor: colors.borderButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.gold, borderColor: colors.gold },
});
