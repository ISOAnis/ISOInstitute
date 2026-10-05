import { useEffect, useState } from 'react';
import { Animated, Easing, PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import type { IsoSummary } from '@/data';
import { areaLabels, MAP_H, MAP_W, mapPoint } from '@/lib/map';
import { colors, fonts, mapColors, radius, tracking } from '@/theme';

import { AREA_BUBBLE_SIZE, AreaBubble } from './AreaBubble';
import { Text } from './Text';

const FOCUS_Y = 120;

type Size = { w: number; h: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const clampPan = (x: number, y: number, s: Size) => ({
  x: clamp(x, Math.min(0, s.w - MAP_W), 0),
  y: clamp(y, Math.min(0, s.h - MAP_H), 0),
});

/**
 * Stylized Denver metro map with ISO area circles. Pans to `focusId`
 * whenever it changes and can be dragged with a finger.
 */
export function IsoMap({
  isos,
  visibleIds,
  focusId,
  onSelect,
  draggable = true,
}: {
  isos: IsoSummary[];
  visibleIds: Set<string>;
  focusId?: string;
  onSelect: (id: string) => void;
  /** Turn off inside scroll views so vertical swipes still scroll the page. */
  draggable?: boolean;
}) {
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [pan] = useState(() => new Animated.ValueXY({ x: 0, y: 0 }));
  const [live] = useState(() => {
    const state = { x: 0, y: 0, size: { w: 0, h: 0 } as Size };
    return Object.assign(state, { resize: (next: Size) => (state.size = next) });
  });

  useEffect(() => {
    const id = pan.addListener((v) => {
      live.x = v.x;
      live.y = v.y;
    });
    return () => pan.removeListener(id);
  }, [pan, live]);

  const focus = isos.find((i) => i.id === focusId);
  const fx = focus ? mapPoint(focus.id, focus.areaName).x : undefined;
  const fy = focus ? mapPoint(focus.id, focus.areaName).y : undefined;

  useEffect(() => {
    if (fx === undefined || fy === undefined || !size.w) return;
    Animated.timing(pan, {
      toValue: clampPan(size.w / 2 - fx, FOCUS_Y - fy, size),
      duration: 650,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [fx, fy, size, pan, live]);

  const [responder] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) + Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        pan.stopAnimation();
        pan.setOffset({ x: live.x, y: live.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const { x, y } = live;
        Animated.spring(pan, { toValue: clampPan(x, y, live.size), useNativeDriver: false, bounciness: 0 }).start();
      },
    }),
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    live.resize({ w: width, h: height });
    setSize({ w: width, h: height });
  };

  const ordered = [...isos].sort((a, b) => Number(a.id === focusId) - Number(b.id === focusId));

  return (
    <View style={styles.frame} onLayout={onLayout} accessibilityLabel="Map of ISOs across the Denver metro" {...(draggable ? responder.panHandlers : null)}>
      <Animated.View style={[styles.canvas, { transform: pan.getTranslateTransform() }]}>
        <View style={[styles.blob, { left: 250, top: 230, width: 170, height: 160, backgroundColor: mapColors.parkA }]} />
        <View style={[styles.blob, { left: 470, top: 300, width: 240, height: 300, backgroundColor: mapColors.parkB }]} />
        <View style={[styles.blob, { left: 80, top: 640, width: 220, height: 150, backgroundColor: mapColors.green }]} />
        <View style={[styles.road, { left: 0, right: 0, top: 330, height: 6, backgroundColor: mapColors.roadMajor }]} />
        <View style={[styles.road, { left: 0, right: 0, top: 560, height: 5, backgroundColor: mapColors.roadMinor }]} />
        <View style={[styles.road, { top: 0, bottom: 0, left: 340, width: 6, backgroundColor: mapColors.roadMajor }]} />
        <View style={[styles.road, { top: 0, bottom: 0, left: 560, width: 4, backgroundColor: mapColors.roadMinor }]} />
        <View style={[styles.road, { left: -80, top: 470, width: 980, height: 5, backgroundColor: mapColors.roadDiagA, transform: [{ rotate: '-24deg' }] }]} />
        <View style={[styles.road, { left: -60, top: 200, width: 900, height: 4, backgroundColor: mapColors.roadDiagB, transform: [{ rotate: '14deg' }] }]} />

        {areaLabels.map((a) => (
          <Text key={a.label} style={[styles.area, { left: a.x, top: a.y }]} color={mapColors.label}>
            {a.label}
          </Text>
        ))}

        {ordered.map((iso) => {
          const p = mapPoint(iso.id, iso.areaName);
          return (
            <View key={iso.id} style={[styles.bubble, { left: p.x - AREA_BUBBLE_SIZE / 2, top: p.y - AREA_BUBBLE_SIZE / 2 }]}>
              <AreaBubble
                pathway={iso.pathway}
                initials={iso.coach.initials}
                selected={iso.id === focusId}
                dimmed={!visibleIds.has(iso.id)}
                onPress={() => onSelect(iso.id)}
                accessibilityLabel={`${iso.title}, ${iso.areaName}`}
              />
            </View>
          );
        })}
      </Animated.View>

      <View style={styles.legend} pointerEvents="none">
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>~5 mi area · exact spot after you’re confirmed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1, overflow: 'hidden', backgroundColor: mapColors.frame },
  canvas: { position: 'absolute', left: 0, top: 0, width: MAP_W, height: MAP_H, backgroundColor: mapColors.ground },
  blob: { position: 'absolute', borderRadius: 999 },
  road: { position: 'absolute' },
  area: { position: 'absolute', fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: tracking(0.18, 11) },
  bubble: { position: 'absolute' },
  legend: {
    position: 'absolute',
    left: 12,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.borderChip,
  },
  legendDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.textMuted },
  legendText: { fontFamily: fonts.bold, fontSize: 11, color: colors.textBody },
});
