import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Icon, ListRow, Screen, Text, TopBar } from '@/components';
import { getCoachNeeds, getCohortInfo, now, useData } from '@/data';
import { shortDate } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, pathwayColors, radius, tracking } from '@/theme';

/** Coaching opens in cohorts: when the next one opens, where coaches are needed, join the list. */
export default function CoachCohorts() {
  const onboarded = useAppStore((s) => s.onboarded);
  const cohort = useData(getCohortInfo, []).data;
  const needs = (useData(getCoachNeeds, []).data ?? []).slice(0, 8);

  const daysOut = cohort ? Math.max(0, Math.ceil((new Date(cohort.opensOn).getTime() - now().getTime()) / 86_400_000)) : 0;
  const asPlayer = () => router.replace(onboarded ? '/map' : '/onboarding/pathway');

  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      <View style={styles.group}>
        <Text variant="eyebrow">Coach on ISO</Text>
        <Text variant="titleLg">Coaching opens in cohorts</Text>
        <Text variant="subtitle">
          The advisory board brings new coaches in together, so every coach gets a real onboarding and every pathway gets the coaches it needs.
        </Text>
      </View>

      {cohort ? (
        <Card style={styles.cohort}>
          <View style={styles.flex}>
            <Text variant="section">Next cohort</Text>
            <Text style={styles.date}>{shortDate(cohort.opensOn)}</Text>
            <Text variant="caption">
              {cohort.name} · opens in {daysOut} days · {cohort.spotsPerPathway} spots per pathway
            </Text>
          </View>
          <Icon name="calendar" size={28} color={colors.gold} />
        </Card>
      ) : null}

      <View style={styles.group}>
        <Text variant="section">Where coaches are needed</Text>
        <Card style={styles.list}>
          {needs.map((n, i) => {
            const p = pathwayColors[n.pathway];
            return (
              <ListRow key={`${n.pathway}-${n.areaName}`} divider={i > 0}>
                <View style={[styles.mark, { backgroundColor: alpha(p.fill, 0.14) }]}>
                  <Icon name={n.pathway} size={20} color={p.text} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{pathwayName(n.pathway)}</Text>
                  <Text variant="caption">
                    {n.areaName} · {n.openSeats} open {n.openSeats === 1 ? 'seat' : 'seats'}
                  </Text>
                </View>
                <Text style={[styles.tag, n.needed ? styles.needed : styles.covered]} color={n.needed ? colors.gold : colors.textSecondary}>
                  {n.needed ? 'Needed' : 'Covered'}
                </Text>
              </ListRow>
            );
          })}
        </Card>
        <Text variant="caption">Based on open seats at upcoming ISOs. Needed means players are filling the ISOs that exist.</Text>
      </View>

      <Button label="Join the list" height={52} onPress={() => router.push('/coach-apply')} />
      <Pressable accessibilityRole="link" onPress={asPlayer} style={styles.link}>
        <Text variant="bodyStrong" color={colors.textSecondary} align="center">
          Not yet? Pull up as a player
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1, gap: 2 },
  cohort: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  date: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48, color: colors.text, letterSpacing: tracking(0.02, 44) },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  mark: { width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  tag: {
    fontFamily: fonts.extrabold,
    fontSize: 12,
    letterSpacing: tracking(0.1, 12),
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  needed: { backgroundColor: alpha(colors.gold, 0.14) },
  covered: { backgroundColor: colors.surface2 },
  link: { minHeight: 44, justifyContent: 'center' },
});
