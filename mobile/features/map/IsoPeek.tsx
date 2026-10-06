import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Icon, IconButton, OverallBox, PathwayDot, Text } from '@/components';
import type { IsoSummary } from '@/data';
import { seatsLabel, whenLabel } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { colors, fonts, gutter, pathwayColors, radius, TAP } from '@/theme';

/**
 * One page of the map's peek sheet. Area name only: no venue name or address
 * ever shows here.
 */
export function IsoPeek({
  iso,
  width,
  counter,
  reasons,
  onPrev,
  onNext,
  onCoachCard,
  onView,
}: {
  iso: IsoSummary;
  width: number;
  counter?: string;
  reasons?: string[];
  onPrev?: () => void;
  onNext?: () => void;
  onCoachCard: () => void;
  onView: () => void;
}) {
  const p = pathwayColors[iso.pathway];
  const full = iso.seatsOpen === 0;

  return (
    <View style={[styles.page, { width }]}>
      <View style={styles.top}>
        {onPrev ? <IconButton icon="back" label="Previous ISO" onPress={onPrev} /> : <View style={styles.spacer} />}
        <View style={styles.pathway}>
          <PathwayDot pathway={iso.pathway} />
          <Text variant="caption" color={p.text} style={styles.bold}>
            {pathwayName(iso.pathway)}
          </Text>
          {counter ? <Text variant="caption">· {counter}</Text> : null}
        </View>
        {onNext ? <IconButton icon="forward" label="Next ISO" onPress={onNext} /> : <View style={styles.spacer} />}
      </View>

      <Text variant="sheetTitle" numberOfLines={2}>
        {iso.title}
      </Text>

      <View style={styles.coach}>
        <Avatar initials={iso.coach.initials} photo={iso.coach.photo} pathway={iso.pathway} size={44} />
        <View style={styles.flex}>
          <Text variant="bodyStrong">{iso.coach.name}</Text>
          <Text variant="caption">
            {iso.coach.tier} coach · {iso.coach.isosHosted} ISOs hosted
          </Text>
        </View>
        <OverallBox value={iso.coach.overall} size={40} />
      </View>

      <View style={styles.facts}>
        <Fact icon="area" text={iso.areaName} />
        <Fact icon="clock" text={whenLabel(iso.startsAt, iso.endsAt)} />
        <View style={styles.fact}>
          <Icon name="users" size={18} color={colors.textSecondary} />
          <Text variant="body" color={full ? colors.textSecondary : p.text} style={styles.bold}>
            {seatsLabel(iso.seatsOpen, iso.seats)}
          </Text>
        </View>
      </View>

      {reasons?.length ? (
        <View style={styles.chips}>
          {reasons.map((r) => (
            <View key={r} style={styles.chip}>
              <Text variant="caption" color={colors.text}>
                {r}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button label="Coach card" icon="idCard" variant="outline" onPress={onCoachCard} style={styles.flex} />
        <Button label="View ISO" onPress={onView} style={styles.flex} />
      </View>
    </View>
  );
}

function Fact({ icon, text }: { icon: 'area' | 'clock'; text: string }) {
  return (
    <View style={styles.fact}>
      <Icon name={icon} size={18} color={colors.textSecondary} />
      <Text variant="body" style={styles.flex}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: gutter, paddingBottom: 16, gap: 14 },
  flex: { flex: 1 },
  bold: { fontFamily: fonts.bold },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: -6 },
  spacer: { width: TAP, height: TAP },
  pathway: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coach: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  facts: { gap: 8 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: colors.surface2, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 2 },
});
