import { Pressable, StyleSheet, View } from 'react-native';

import type { IsoSummary } from '@/data';
import { seatsLabel, whenLabel } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { colors, fonts, pathwayColors, radius, tracking } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

/** Overall badge with a pathway-colored top edge. */
export function OverallBox({ value, pathway, size = 52 }: { value: number; pathway: IsoSummary['pathway']; size?: number }) {
  return (
    <View style={[styles.ovr, { width: size, height: size, borderTopColor: pathwayColors[pathway].fill }]}>
      <Text style={[styles.ovrNum, { fontSize: Math.round(size * 0.46), lineHeight: Math.round(size * 0.46) }]} color={colors.gold}>
        {value}
      </Text>
      <Text style={styles.ovrLabel} color={colors.textMuted}>
        OVERALL
      </Text>
    </View>
  );
}

function Arrow({ dir, onPress, disabled }: { dir: 'back' | 'forward'; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={dir === 'back' ? 'Previous ISO' : 'Next ISO'}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.arrow, pressed && styles.arrowPressed, disabled && styles.arrowOff]}
    >
      <Icon name={dir} size={20} color={disabled ? colors.textDisabled : colors.textBody} strokeWidth={2.6} />
    </Pressable>
  );
}

/**
 * ISO summary for the map sheet: eyebrow + counter, Overall, title, coach and
 * pathway, time, area and seats, "why" chips, and the two actions. Pass
 * `onPrev`/`onNext` to show the carousel arrows.
 */
export function IsoCard({
  iso,
  eyebrow,
  counter,
  reasons,
  onPrev,
  onNext,
  onCoachCard,
  onView,
}: {
  iso: IsoSummary;
  eyebrow?: string;
  counter?: string;
  reasons?: string[];
  onPrev?: () => void;
  onNext?: () => void;
  onCoachCard?: () => void;
  onView?: () => void;
}) {
  const p = pathwayColors[iso.pathway];
  const arrows = Boolean(onPrev || onNext);

  const info = (
    <View style={styles.info}>
      {eyebrow || counter ? (
        <View style={styles.eyebrowRow}>
          <Text style={styles.eyebrow} color={colors.gold} numberOfLines={1}>
            {eyebrow}
          </Text>
          {counter ? (
            <Text style={styles.counter} color={colors.textDim}>
              {counter}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.top}>
        <OverallBox value={iso.coach.overall} pathway={iso.pathway} />
        <View style={styles.titleCol}>
          <Text variant="rowTitle" style={styles.title} numberOfLines={2}>
            {iso.title}
          </Text>
          <Text variant="caption" color={colors.textMuted}>
            {iso.coach.name} ·{' '}
            <Text variant="caption" color={p.text} style={styles.strong}>
              {pathwayName(iso.pathway)}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.metaCol}>
        <View style={styles.meta}>
          <Icon name="clock" size={14} color={colors.textMuted} />
          <Text variant="caption" color={colors.textBody}>
            {whenLabel(iso.startsAt, iso.endsAt)}
          </Text>
        </View>
        <View style={styles.meta}>
          <Icon name="area" size={14} color={colors.textMuted} />
          <Text variant="caption" color={colors.textBody}>
            {iso.areaName} ·{' '}
            <Text variant="caption" color={p.text} style={styles.strong}>
              {seatsLabel(iso.seatsOpen, iso.seats)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.wrap}>
      {arrows ? (
        <View style={styles.carousel}>
          <Arrow dir="back" onPress={onPrev} disabled={!onPrev} />
          {info}
          <Arrow dir="forward" onPress={onNext} disabled={!onNext} />
        </View>
      ) : (
        info
      )}

      {reasons?.length ? (
        <View style={[styles.chips, arrows && styles.inset]}>
          {reasons.map((r) => (
            <View key={r} style={styles.chip}>
              <Text variant="tiny" color={colors.textBody} style={styles.chipText}>
                {r}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={[styles.actions, arrows && styles.inset]}>
        <Button label="Coach card" icon="idCard" variant="outline" onPress={onCoachCard} style={styles.action} />
        <Button label="View ISO" onPress={onView} style={styles.action} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  carousel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrow: {
    width: 40,
    height: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderAlt,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowPressed: { backgroundColor: colors.surfaceBox },
  arrowOff: { opacity: 0.4 },
  info: { flex: 1, minWidth: 0, gap: 10, paddingHorizontal: 4 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  eyebrow: { flex: 1, fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: tracking(0.14, 11) },
  counter: { fontFamily: fonts.bold, fontSize: 11 },
  top: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  ovr: {
    backgroundColor: colors.surfaceBox,
    borderWidth: 1,
    borderColor: colors.borderBox,
    borderTopWidth: 4,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovrNum: { fontFamily: fonts.display },
  ovrLabel: { fontFamily: fonts.extrabold, fontSize: 7, letterSpacing: 0.8, marginTop: 1 },
  titleCol: { flex: 1, gap: 3, minWidth: 0 },
  title: { fontSize: 16, lineHeight: 20 },
  strong: { fontFamily: fonts.bold },
  metaCol: { gap: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderChipAlt,
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipText: { fontFamily: fonts.semibold },
  actions: { flexDirection: 'row', gap: 10 },
  inset: { paddingHorizontal: 8 },
  action: { flex: 1 },
});
