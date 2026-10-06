import { Pressable, StyleSheet, View } from 'react-native';

import type { IsoSummary } from '@/data';
import { seatsLabel, whenLabel } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { colors, fonts, pathwayColors, radius } from '@/theme';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

/** Overall number in gold Bebas with a readable label underneath. */
export function OverallBox({ value, size = 52 }: { value: number; pathway?: IsoSummary['pathway']; size?: number }) {
  const fontSize = Math.round(size * 0.62);
  return (
    <View style={styles.ovr} accessible accessibilityLabel={`Overall ${value}`}>
      <Text style={[styles.ovrNum, { fontSize, lineHeight: Math.ceil(fontSize * 1.05) }]} color={colors.gold}>
        {value}
      </Text>
      <Text variant="caption">Overall</Text>
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
      <Icon name={dir} size={20} color={disabled ? colors.textDisabled : colors.text} strokeWidth={2.6} />
    </Pressable>
  );
}

/**
 * ISO summary for the map sheet: label + counter, coach photo, title, coach and
 * pathway, Overall, time, area and seats, "why" chips, and the two actions.
 * Pass `onPrev`/`onNext` to show the carousel arrows.
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
          <Text variant="section" style={styles.flex} numberOfLines={1}>
            {eyebrow}
          </Text>
          {counter ? <Text variant="caption">{counter}</Text> : null}
        </View>
      ) : null}
      <View style={styles.top}>
        <Avatar initials={iso.coach.initials} photo={iso.coach.photo} pathway={iso.pathway} size={52} />
        <View style={styles.titleCol}>
          <Text variant="cardTitle" numberOfLines={2}>
            {iso.title}
          </Text>
          <Text variant="caption">
            {iso.coach.name} ·{' '}
            <Text variant="caption" color={p.text} style={styles.strong}>
              {pathwayName(iso.pathway)}
            </Text>
          </Text>
        </View>
        <OverallBox value={iso.coach.overall} size={40} />
      </View>
      <View style={styles.metaCol}>
        <View style={styles.meta}>
          <Icon name="clock" size={16} color={colors.textSecondary} />
          <Text variant="caption" color={colors.text}>
            {whenLabel(iso.startsAt, iso.endsAt)}
          </Text>
        </View>
        <View style={styles.meta}>
          <Icon name="area" size={16} color={colors.textSecondary} />
          <Text variant="caption" color={colors.text}>
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
              <Text variant="caption" color={colors.text}>
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
  wrap: { gap: 14 },
  flex: { flex: 1 },
  carousel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrow: {
    width: 40,
    height: 120,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowPressed: { backgroundColor: colors.surface3 },
  arrowOff: { opacity: 0.4 },
  info: { flex: 1, minWidth: 0, gap: 12, paddingHorizontal: 4 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  top: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  ovr: { alignItems: 'center' },
  ovrNum: { fontFamily: fonts.display },
  titleCol: { flex: 1, gap: 2, minWidth: 0 },
  strong: { fontFamily: fonts.bold },
  metaCol: { gap: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: colors.surface2,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  actions: { flexDirection: 'row', gap: 10 },
  inset: { paddingHorizontal: 8 },
  action: { flex: 1 },
});
