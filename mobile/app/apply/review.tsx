import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, CoachCardFull, Screen, Text, TopBar } from '@/components';
import {
  AVAILABILITY_OPTIONS,
  COACH_APPLY_STEPS,
  coachCardFromDraft,
  getCoachDraft,
  getVenues,
  HOST_FREQUENCY_OPTIONS,
  missingCoachSteps,
  useData,
  type CoachApplicationDraft,
  type CoachApplyStep,
  type Venue,
} from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { applyStepHref } from '@/features/apply/steps';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, statusColors } from '@/theme';

const labelOf = <T extends string>(options: { id: T; label: string }[], id?: T) => options.find((o) => o.id === id)?.label;

/** What each saved step says, in a line or three. */
function summary(step: CoachApplyStep, d: CoachApplicationDraft, venues: Venue[]): string[] {
  switch (step) {
    case 'basics':
      return d.basics ? [d.basics.fullName, d.basics.email, d.basics.phone, `${d.basics.neighborhood}, ${d.basics.city}`] : [];
    case 'path':
      return d.path?.pathway ? [pathwayName(d.path.pathway), `${d.path.role} at ${d.path.organization}`] : [];
    case 'experience':
      if (!d.background) return [];
      return [
        ...d.background.experience.map((e) => `${e.role}, ${e.organization} · ${e.years} ${e.years === 1 ? 'yr' : 'yrs'}`),
        ...(d.background.education ? [[d.background.education.school, d.background.education.field].filter(Boolean).join(', ')] : []),
        d.background.skills.join(', '),
      ];
    case 'why':
      return d.why ? [d.why.motivation, ...(d.why.showCardLine ? [`On your card: “${d.why.cardLine}”`] : [])] : [];
    case 'topics':
      return d.topics ? [d.topics.join(', ')] : [];
    case 'hosting': {
      const h = d.hosting;
      if (!h) return [];
      const spots = venues.filter((v) => h.venueIds.includes(v.id)).map((v) => v.name);
      return [
        h.areas.join(', '),
        ...(spots.length ? [spots.join(', ')] : []),
        h.availability.map((a) => labelOf(AVAILABILITY_OPTIONS, a)).join(', '),
        `${labelOf(HOST_FREQUENCY_OPTIONS, h.frequency)} · ${h.groupSize} players`,
      ];
    }
    case 'guidelines':
      return d.guidelinesAgreedAt ? ['Agreed to all five'] : [];
    case 'verify':
      if (!d.idCheck) return [];
      return [d.idCheck.status === 'verified' ? 'ID verified' : d.idCheck.status === 'in_review' ? 'ID check in review' : 'ID check didn’t go through'];
    case 'extras': {
      const e = d.extras;
      const lines = [e?.linkedIn, e?.invitedBy && `Invited by ${e.invitedBy}`, e?.heardFrom && `Heard from ${e.heardFrom.toLowerCase()}`].filter(Boolean);
      return lines.length ? (lines as string[]) : ['Skipped'];
    }
    default:
      return [];
  }
}

/** Step 10: everything in one place with edit links, the pending card, and submit. */
export default function ApplyReview() {
  const revision = useAppStore((s) => s.revision);
  const submitCoachApplication = useAppStore((s) => s.submitCoachApplication);
  const draft = useData(getCoachDraft, [revision]).data;
  const venues = useData(getVenues, []).data ?? [];
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  if (!draft) return <Screen>{null}</Screen>;

  const missing = missingCoachSteps(draft);
  const card = coachCardFromDraft(draft);
  const steps = COACH_APPLY_STEPS.filter((s) => s.id !== 'review');

  const submit = async () => {
    setSending(true);
    setError('');
    try {
      await submitCoachApplication();
      router.replace('/coach-review');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      <ApplyProgress step="review" />

      <View style={styles.group}>
        <Text variant="titleLg">Review and submit</Text>
        <Text variant="subtitle">Check it over. Tap Edit to change anything.</Text>
      </View>

      {card ? (
        <View style={styles.group}>
          <Text variant="section">Your coach card</Text>
          <CoachCardFull coach={card} pending />
        </View>
      ) : null}

      {steps.map((s, i) => {
        const done = draft.saved.includes(s.id);
        const lines = done ? summary(s.id, draft, venues) : [];
        return (
          <Card key={s.id} style={styles.card}>
            <View style={styles.head}>
              <Text variant="section" style={styles.flex}>
                {i + 1}. {s.title}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${done ? 'Edit' : 'Finish'} ${s.title}`}
                onPress={() => router.push(applyStepHref(s.id, { edit: true }))}
                style={styles.edit}
              >
                <Text style={styles.editLabel} color={colors.gold}>
                  {done ? 'Edit' : 'Finish'}
                </Text>
              </Pressable>
            </View>
            {done ? (
              lines.map((l, j) => (
                <Text key={j} variant={j === 0 ? 'bodyStrong' : 'body'} numberOfLines={s.id === 'why' ? 3 : undefined}>
                  {l}
                </Text>
              ))
            ) : (
              <Text variant="caption" color={statusColors.bad}>
                Not done yet
              </Text>
            )}
          </Card>
        );
      })}

      {error ? (
        <Text variant="caption" color={statusColors.bad}>
          {error}
        </Text>
      ) : null}
      {draft.submittedAt ? (
        <Button label="See your application" height={52} onPress={() => router.replace('/coach-review')} />
      ) : (
        <Button
          label={
            sending ? 'Sending…' : missing.length ? `Finish ${missing.length} more ${missing.length === 1 ? 'step' : 'steps'} to submit` : 'Submit application'
          }
          height={52}
          disabled={sending || missing.length > 0}
          onPress={submit}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1 },
  card: { gap: 6 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: -10, marginBottom: -6 },
  edit: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  editLabel: { fontFamily: fonts.bold, fontSize: 15 },
});
