import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, CoachCardFull, Icon, Screen, Text, TopBar } from '@/components';
import {
  ACTIVE_WINDOW_DAYS,
  getApplication,
  getAreaReviewRequests,
  getCoachNeeds,
  getCoachPreview,
  getCohortInfo,
  getMe,
  getPathIn,
  ROOKIE_ISOS,
  useData,
  type PathwayId,
} from '@/data';
import { shortDate } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, pathwayColors, radius, statusColors, tracking } from '@/theme';

type Outcome = 'in' | 'next' | 'path';

/** The advisory board's decision: you're in, you're next, or your path in. */
export default function CoachDecision() {
  const { outcome = 'in' } = useLocalSearchParams<{ outcome?: Outcome }>();
  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      {outcome === 'next' ? <YoureNext /> : outcome === 'path' ? <PathIn /> : <YoureIn />}
    </Screen>
  );
}

function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <View style={styles.group}>
      <Text variant="eyebrow">Advisory board decision</Text>
      <Text variant="titleLg">{title}</Text>
      <Text variant="subtitle">{sub}</Text>
    </View>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.dot} />
      <Text variant="body" style={styles.flex}>
        {children}
      </Text>
    </View>
  );
}

function YoureIn() {
  const preview = useData(getCoachPreview, []).data;
  const cohort = useData(getCohortInfo, []).data;
  const { approveCoachDemo, enterApp } = useAppStore.getState();

  const dropFirstPin = async () => {
    await approveCoachDemo();
    enterApp('coach');
    router.replace('/manage');
    router.push('/drop-pin');
  };

  return (
    <>
      <Header title="You’re in" sub={`Welcome to ${cohort?.name ?? 'the next cohort'}. Your card goes live with your first pin.`} />
      {preview ? <CoachCardFull coach={preview} /> : null}

      <Card>
        <View style={styles.rookieHead}>
          <Text variant="bodyStrong">Rookie · 0 of {ROOKIE_ISOS} ISOs</Text>
        </View>
        <View style={styles.steps}>
          {Array.from({ length: ROOKIE_ISOS }, (_, i) => (
            <View key={i} style={styles.step} />
          ))}
        </View>
        <Bullet>{`Your first ${ROOKIE_ISOS} ISOs carry a Rookie badge, and the board reviews player feedback from each one.`}</Bullet>
        <Bullet>No term limits. Coach for as long as you serve your players.</Bullet>
        <Bullet>{`Host at least once every ${ACTIVE_WINDOW_DAYS} days to stay active.`}</Bullet>
      </Card>

      <Button label="Drop your first pin" height={52} onPress={dropFirstPin} />
    </>
  );
}

function YoureNext() {
  const cohort = useData(getCohortInfo, []).data;
  const app = useData(getApplication, []).data;
  const me = useData(getMe, []).data;
  const needs = useData(getCoachNeeds, []).data ?? [];
  const { requestAreaReview, enterApp } = useAppStore.getState();

  const pathway: PathwayId = app?.pathway ?? me?.pathway ?? 'founder';
  const name = pathwayName(pathway);
  const need = needs.find((n) => n.needed && n.pathway === pathway);

  const asPlayer = () => {
    enterApp('player');
    router.replace('/map');
  };

  return (
    <>
      <Header title="You’re next" sub={`The board liked what it saw. ${name} filled up this cohort, so you’re in line for the next one.`} />

      {cohort ? (
        <Card style={styles.position}>
          <Text style={styles.big} color={colors.gold}>
            #{cohort.waitlistPosition}
          </Text>
          <View style={styles.flex}>
            <Text variant="bodyStrong">In line for {cohort.name}</Text>
            <Text variant="caption">Opens {shortDate(cohort.opensOn)}. When a spot opens, you move up.</Text>
          </View>
        </Card>
      ) : null}

      <Card>
        <Text variant="section">Why the wait</Text>
        <Text variant="body">
          Each pathway takes {cohort?.spotsPerPathway ?? 6} new coaches per cohort. That keeps onboarding real and makes sure every new coach has players to
          coach.
        </Text>
      </Card>

      {need ? <NeedCard area={need.areaName} pathway={need.pathway} onRequest={() => requestAreaReview(need.areaName)} /> : null}

      <Button label="Pull up as a player" height={52} onPress={asPlayer} />
    </>
  );
}

function NeedCard({ area, pathway, onRequest }: { area: string; pathway: PathwayId; onRequest: () => Promise<void> }) {
  const revision = useAppStore((s) => s.revision);
  const asked = (useData(getAreaReviewRequests, [revision]).data ?? []).includes(area);
  const p = pathwayColors[pathway];
  return (
    <Card style={{ backgroundColor: alpha(p.fill, 0.1) }}>
      <View style={styles.rookieHead}>
        <Icon name={pathway} size={20} color={p.text} />
        <Text variant="eyebrow" color={p.text}>
          Optional
        </Text>
      </View>
      <Text variant="cardTitle">Coaches needed in {area}</Text>
      <Text variant="body">
        {pathwayName(pathway)} ISOs in {area} are filling up. Ask the board to review you for {area} and you could get in before the next cohort.
      </Text>
      {asked ? (
        <View style={styles.rookieHead}>
          <Icon name="check" size={18} color={statusColors.good} strokeWidth={2.6} />
          <Text variant="bodyStrong" color={statusColors.good}>
            Requested. The board will look at {area} first.
          </Text>
        </View>
      ) : (
        <Button label={`Request review in ${area}`} variant="outline" height={44} onPress={onRequest} />
      )}
    </Card>
  );
}

function PathIn() {
  const path = useData(getPathIn, []).data;
  const { enterApp } = useAppStore.getState();
  if (!path) return null;
  const name = pathwayName(path.pathway);
  const p = pathwayColors[path.pathway];
  const done = path.attended >= path.needed;

  const findIso = () => {
    enterApp('player');
    router.replace(`/map?pill=${path.pathway}`);
  };

  return (
    <>
      <Header title="Your path in" sub="Not this cohort. Here’s exactly what gets you there." />

      <Card>
        <Text variant="section">From the board</Text>
        <Text style={styles.reason} color={colors.gold}>
          {path.category}
        </Text>
        <Text variant="body">{path.note}</Text>
      </Card>

      <Card>
        <Text variant="section">Play first</Text>
        <Text variant="bodyStrong">
          Attend {path.needed} {name} ISOs as a player, then reapply.
        </Text>
        <View style={styles.steps}>
          {Array.from({ length: path.needed }, (_, i) => (
            <View key={i} style={[styles.stepTall, i < path.attended && { backgroundColor: p.fill }]}>
              {i < path.attended ? <Icon name="check" size={14} color={p.ink} strokeWidth={2.6} /> : null}
            </View>
          ))}
        </View>
        <Text variant="caption" color={colors.text}>
          {path.attended} of {path.needed} {name} ISOs · {done ? 'reapply is open' : 'reapply unlocks automatically'}
        </Text>
        <Button
          label={done ? 'Reapply' : `Reapply unlocks after ${path.needed - path.attended} more`}
          variant="outline"
          icon={done ? undefined : 'lock'}
          height={44}
          disabled={!done}
          onPress={() => router.replace('/coach-apply')}
        />
      </Card>

      <Button label={`Find a ${name} ISO`} height={52} onPress={findIso} />
    </>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  flex: { flex: 1, gap: 2 },
  bullet: { flexDirection: 'row', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold, marginTop: 9 },
  rookieHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  steps: { flexDirection: 'row', gap: 6 },
  step: { flex: 1, height: 8, borderRadius: radius.pill, backgroundColor: colors.surface3 },
  stepTall: { flex: 1, height: 28, borderRadius: radius.pill, backgroundColor: colors.surface3, alignItems: 'center', justifyContent: 'center' },
  position: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  big: { fontFamily: fonts.display, fontSize: 64, lineHeight: 70, letterSpacing: tracking(0.02, 64) },
  reason: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34, letterSpacing: tracking(0.02, 30), textTransform: 'uppercase' },
});
