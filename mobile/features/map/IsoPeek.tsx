import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Icon, Text, type IconName } from '@/components';
import type { IsoSummary } from '@/data';
import { seatsLabel, whenLabel } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { alpha, colors, fonts, gutter, pathwayColors, radius, TAP, tracking } from '@/theme';

/**
 * One page of the map's peek sheet: a compact card that keeps the map in view.
 * Area name only: no venue name or address ever shows here.
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
        <View style={[styles.tag, { backgroundColor: alpha(p.fill, 0.14) }]}>
          <Icon name={iso.pathway} size={14} color={p.text} />
          <Text style={styles.tagText} color={p.text}>
            {pathwayName(iso.pathway)}
          </Text>
        </View>
        {iso.groupFor ? (
          <View style={styles.group}>
            <Text style={styles.groupText} color={colors.text}>
              {iso.groupFor === 'women' ? 'Women’s ISO' : 'Men’s ISO'}
            </Text>
          </View>
        ) : null}
        {counter ? <Text variant="caption">{counter}</Text> : null}
        <View style={styles.flex} />
        {onPrev ? <Step icon="back" label="Previous ISO" onPress={onPrev} /> : null}
        {onNext ? <Step icon="forward" label="Next ISO" onPress={onNext} /> : null}
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {iso.title}
        </Text>
        <View style={styles.meta}>
          <Meta icon="area" text={iso.areaName} />
          <Meta icon="clock" text={whenLabel(iso.startsAt, iso.endsAt)} />
          <Meta icon="users" text={seatsLabel(iso.seatsOpen, iso.seats)} color={full ? colors.textMeta : p.text} strong />
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Coach card for ${iso.coach.name}, ${iso.coach.overall} Overall`}
          onPress={onCoachCard}
          style={({ pressed }) => [styles.coach, pressed && styles.pressed]}
        >
          <Avatar initials={iso.coach.initials} photo={iso.coach.photo} pathway={iso.pathway} size={38} />
          <View style={styles.flex}>
            <Text variant="bodyStrong" numberOfLines={1}>
              {iso.coach.name}
            </Text>
            <Text variant="caption" numberOfLines={1}>
              <Text variant="caption" color={colors.gold} style={styles.bold}>
                {iso.coach.overall} Overall
              </Text>{' '}
              · {iso.coach.tier}
            </Text>
          </View>
          <Icon name="forward" size={14} color={colors.textMeta} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ISO: ${iso.title}`}
          onPress={onView}
          style={({ pressed }) => [styles.view, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.viewText} color={colors.onGold}>
            View ISO
          </Text>
          <Icon name="forward" size={16} color={colors.onGold} strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

function Step({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
      style={({ pressed }) => [styles.step, pressed && styles.pressed]}
    >
      <Icon name={icon} size={16} color={colors.textSecondary} />
    </Pressable>
  );
}

function Meta({ icon, text, color = colors.textSecondary, strong }: { icon: IconName; text: string; color?: string; strong?: boolean }) {
  return (
    <View style={styles.metaItem}>
      <Icon name={icon} size={14} color={color} />
      <Text variant="caption" color={color} style={strong && styles.bold}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: gutter, paddingBottom: 12, gap: 12 },
  flex: { flex: 1 },
  bold: { fontFamily: fonts.bold },
  pressed: { backgroundColor: colors.surface3 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, height: 26, borderRadius: radius.pill },
  group: { height: 26, paddingHorizontal: 10, justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.surface2 },
  groupText: { fontFamily: fonts.bold, fontSize: 12 },
  tagText: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: tracking(0.04, 12) },
  step: { width: TAP, height: 32, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface2 },
  titleBlock: { gap: 6 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, color: colors.text, letterSpacing: tracking(0.01, 26), textTransform: 'uppercase' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: colors.surface2, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  actions: { flexDirection: 'row', gap: 8 },
  coach: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
    paddingLeft: 9,
    paddingRight: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.gold,
  },
  viewText: { fontFamily: fonts.bold, fontSize: 15 },
});
