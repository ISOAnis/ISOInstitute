import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutRectangle,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { Button, PathwayDot, Text } from '@/components';
import { getEvents, useData, type IsoEvent } from '@/data';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, gutter, pathwayColors, radius, TAP } from '@/theme';

/**
 * The Court: curated pathway events. Each event fills the page; swipe sideways
 * between them and the pathway strip up top follows. Shared by player and coach tabs.
 */
export function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const events = useData(getEvents, []).data ?? [];
  const [index, setIndex] = useState(0);
  const [pageH, setPageH] = useState(0);
  const pager = useRef<FlatList<IsoEvent>>(null);
  const strip = useRef<ScrollView>(null);
  const tabs = useRef<Record<number, LayoutRectangle>>({});

  const centerTab = (i: number, animated = true) => {
    const t = tabs.current[i];
    if (t) strip.current?.scrollTo({ x: Math.max(0, t.x + t.width / 2 - width / 2), animated });
  };

  const show = (i: number) => {
    if (i === index) return;
    setIndex(i);
    centerTab(i);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i >= 0 && i < events.length) show(i);
  };

  const jump = (i: number) => {
    pager.current?.scrollToIndex({ index: i, animated: true });
    show(i);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.head}>
        <Text variant="eyebrow">Curated by ISO · Denver</Text>
        <Text variant="title">Events</Text>
      </View>

      <ScrollView ref={strip} horizontal showsHorizontalScrollIndicator={false} style={styles.stripScroll} contentContainerStyle={styles.strip}>
        {events.map((e, i) => {
          const active = i === index;
          const p = pathwayColors[e.pathway];
          return (
            <Pressable
              key={e.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${pathwayName(e.pathway)}: ${e.title}`}
              onPress={() => jump(i)}
              onLayout={(ev) => {
                tabs.current[i] = ev.nativeEvent.layout;
              }}
              style={[styles.tab, active && { backgroundColor: alpha(p.fill, 0.16), borderColor: alpha(p.fill, 0.5) }]}
            >
              <PathwayDot pathway={e.pathway} />
              <Text style={[styles.tabText, { fontFamily: active ? fonts.bold : fonts.semibold }]} color={active ? p.text : colors.textSecondary}>
                {pathwayName(e.pathway)}
              </Text>
              <Text style={styles.tabMonth} color={active ? colors.text : colors.textMeta}>
                {e.monthLabel}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        ref={pager}
        data={events}
        keyExtractor={(e) => e.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        style={styles.pager}
        onLayout={(e) => setPageH(e.nativeEvent.layout.height)}
        renderItem={({ item }) => (
          <View style={[styles.page, { width, height: pageH || undefined }]}>
            <EventPage event={item} />
          </View>
        )}
      />

      {events.length > 1 ? (
        <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {events.map((e, i) => (
            <View key={e.id} style={[styles.dot, i === index && { width: 18, backgroundColor: pathwayColors[e.pathway].fill }]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function EventPage({ event }: { event: IsoEvent }) {
  const rsvps = useAppStore((s) => s.rsvps);
  const toggleRsvp = useAppStore((s) => s.toggleRsvp);
  const p = pathwayColors[event.pathway];
  const line = alpha(p.fill, 0.5);
  const going = rsvps.includes(event.id);
  const dated = event.monthLabel !== 'TBA';

  return (
    <View style={styles.card}>
      <View style={[styles.art, { backgroundColor: alpha(p.fill, 0.12) }]}>
        <Svg width="100%" height="100%" viewBox="0 0 350 150" preserveAspectRatio="xMidYMid meet">
          <Rect x={20} y={14} width={310} height={122} rx={4} stroke={line} strokeWidth={2} fill="none" />
          <Line x1={175} y1={14} x2={175} y2={136} stroke={line} strokeWidth={2} />
          <Circle cx={175} cy={75} r={26} stroke={line} strokeWidth={2} fill="none" />
          <Rect x={20} y={45} width={52} height={60} stroke={alpha(p.fill, 0.35)} strokeWidth={2} fill="none" />
          <Rect x={278} y={45} width={52} height={60} stroke={alpha(p.fill, 0.35)} strokeWidth={2} fill="none" />
        </Svg>
        <View style={styles.tag}>
          <PathwayDot pathway={event.pathway} />
          <Text variant="caption" color={p.text} style={styles.bold}>
            {pathwayName(event.pathway)} pathway event
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text variant="hero" numberOfLines={2}>
          {event.title}
        </Text>
        <Text variant="body" numberOfLines={4}>
          {event.description}
        </Text>
        <View style={styles.facts}>
          <Fact label="When" value={dated ? `${event.monthLabel} · [Date]` : 'Date TBA'} />
          <Fact label="Where" value={event.venueLabel} />
          <Fact label="Ticket" value={event.ticketLabel} />
        </View>
        {event.prize || event.sponsor ? (
          <Text variant="caption" numberOfLines={2}>
            {[event.prize ? `Prize: ${event.prize}` : null, event.sponsor ? `Presented by ${event.sponsor}` : null].filter(Boolean).join(' · ')}
          </Text>
        ) : null}
        {going ? (
          <Button label="You’re in. See you on the court." variant="outline" icon="check" height={52} onPress={() => toggleRsvp(event.id)} />
        ) : (
          <Button label={event.featured ? 'RSVP · Limited spots' : 'RSVP'} height={52} onPress={() => toggleRsvp(event.id)} />
        )}
      </View>
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text variant="section">{label}</Text>
      <Text variant="bodyStrong" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingBottom: 12, gap: 14 },
  head: { gap: 6, paddingHorizontal: gutter },
  stripScroll: { flexGrow: 0 },
  strip: { gap: 8, paddingHorizontal: gutter, alignItems: 'center' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minHeight: TAP,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.transparent,
    backgroundColor: colors.surface1,
  },
  tabText: { fontSize: 15 },
  tabMonth: { fontFamily: fonts.display, fontSize: 17, lineHeight: 20 },
  pager: { flex: 1 },
  page: { paddingHorizontal: gutter },
  card: { flex: 1, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.surface1 },
  art: { flex: 1, minHeight: 96 },
  bold: { fontFamily: fonts.bold },
  tag: {
    position: 'absolute',
    left: 14,
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.overlay,
  },
  body: { padding: 20, gap: 12 },
  facts: { flexDirection: 'row', gap: 12 },
  fact: { flex: 1, gap: 2 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surface3 },
});
