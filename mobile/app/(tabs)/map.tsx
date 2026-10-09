import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Glass, Icon, PathwayDot, Pill, Text, useTabBarHeight, Wordmark } from '@/components';
import { getIsos, useData, type IsoFilter, type IsoListItem, type PathwayId } from '@/data';
import { DENVER_METRO, displayPoint, focusRegion, regionAround } from '@/features/map/geo';
import { IsoPeek } from '@/features/map/IsoPeek';
import { MapCanvas } from '@/features/map/MapCanvas';
import type { LatLng, MapCanvasHandle } from '@/features/map/types';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, gutter, pathwayColors, pathwayOrder, radius, raisedShadow, TAP } from '@/theme';

const mark = require('../../assets/iso-mark.png');

type PillKey = 'all' | 'recommended' | 'following' | PathwayId;

const toFilter = (k: PillKey): IsoFilter =>
  k === 'all' ? { kind: 'all' } : k === 'recommended' ? { kind: 'recommended' } : k === 'following' ? { kind: 'following' } : { kind: 'pathway', pathway: k };

/** Rough peek height until the sheet reports its real size. */
const PEEK_GUESS = 340;

export default function MapScreen() {
  return <PlayerMap />;
}

function PlayerMap() {
  const insets = useSafeAreaInsets();
  const screen = useWindowDimensions();
  const tabH = useTabBarHeight();
  const params = useLocalSearchParams<{ pill?: string }>();
  const revision = useAppStore((s) => s.revision);
  const map = useRef<MapCanvasHandle>(null);
  const sheet = useRef<BottomSheet>(null);
  const pager = useRef<FlatList<IsoListItem>>(null);
  const picked = useRef(false);

  const [pill, setPill] = useState<PillKey>((params.pill as PillKey) ?? 'all');
  const [selectedId, setSelectedId] = useState<string>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [headerH, setHeaderH] = useState(insets.top + 104);
  const [peekH, setPeekH] = useState(PEEK_GUESS);
  const [me, setMe] = useState<LatLng>();

  const all = useData(() => getIsos(), [revision]).data ?? [];
  const shown = useData(() => getIsos(toFilter(pill)), [pill, revision]).data;
  const list = shown ?? [];
  const visible = new Set(list.map((i) => i.id));
  const selIndex = list.findIndex((i) => i.id === selectedId);

  // On Android the native map shifts its own center by mapPadding; Apple Maps doesn't.
  const mapPadding = { top: headerH, bottom: tabH, left: 0, right: 0 };
  const cameraInsets = Platform.OS === 'android' ? mapPadding : { top: 0, bottom: 0 };

  useEffect(() => {
    if (Platform.OS === 'web') return;
    let live = true;
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted || !live) return;
      const pos = (await Location.getLastKnownPositionAsync()) ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
      if (live && pos) setMe({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const focus = (iso: IsoListItem) =>
    map.current?.animateToRegion(focusRegion(displayPoint(iso), screen, { top: headerH, bottom: tabH + peekH }, cameraInsets));

  const goTo = (index: number, scrollPager = true) => {
    const iso = list[index];
    if (!iso) return;
    setSelectedId(iso.id);
    focus(iso);
    if (scrollPager) pager.current?.scrollToIndex({ index, animated: sheetOpen });
    sheet.current?.snapToIndex(0);
  };

  const selectDot = (id: string) => {
    const index = list.findIndex((i) => i.id === id);
    if (index < 0) router.push(`/iso/${id}`);
    else goTo(index);
  };

  const step = (d: number) => goTo((selIndex + d + list.length) % list.length);

  const deselect = () => {
    setSelectedId(undefined);
    sheet.current?.close();
  };

  const pick = (k: PillKey) => {
    if (k === pill) return;
    picked.current = true;
    setPill(k);
    deselect();
  };

  // After a pill change, frame that filter's dots (or show the empty state).
  useEffect(() => {
    if (!shown || !picked.current) return;
    if (!shown.length) {
      sheet.current?.snapToIndex(0);
      return;
    }
    const points = shown.map(displayPoint);
    if (points.length === 1) {
      map.current?.animateToRegion(regionAround(points[0], 0.3, screen.width / screen.height));
    } else {
      map.current?.fitTo(points, { top: headerH + 48, bottom: tabH + 72, left: 56, right: 56 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  const recenter = () => map.current?.animateToRegion(me ? regionAround(me, 0.15, screen.width / screen.height) : DENVER_METRO);

  const onPage = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / screen.width);
    if (list[index] && list[index].id !== selectedId) goTo(index, false);
  };

  const emptyPath = pill !== 'all' && pill !== 'recommended' && pill !== 'following' ? pill : undefined;

  return (
    <View style={styles.root}>
      <MapCanvas
        ref={map}
        isos={all}
        visibleIds={visible}
        selectedId={selectedId}
        onSelectIso={selectDot}
        onPressMap={selectedId || sheetOpen ? deselect : undefined}
        showsUserLocation={!!me}
        padding={mapPadding}
      />

      <Glass style={[styles.header, { paddingTop: insets.top + 6 }]} onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
        <View style={styles.brandRow}>
          <View style={styles.lockup}>
            <Image source={mark} style={styles.mark} resizeMode="contain" />
            <Wordmark size={30} />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Area: Denver metro" style={styles.areaChip}>
            <Icon name="pin" size={15} color={colors.textSecondary} />
            <Text style={styles.areaText}>Denver metro</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
          <Pill label="All ISOs" active={pill === 'all'} onPress={() => pick('all')} />
          <Pill label="Recommended" active={pill === 'recommended'} onPress={() => pick('recommended')} />
          <Pill label="Following" active={pill === 'following'} onPress={() => pick('following')} />
          {pathwayOrder.map((id) => (
            <Pill key={id} pathway={id} label={pathwayName(id)} active={pill === id} onPress={() => pick(id)} />
          ))}
        </ScrollView>
      </Glass>

      {!sheetOpen ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={me ? 'Recenter on your location' : 'Recenter on Denver metro'}
          onPress={recenter}
          style={[styles.recenter, { bottom: tabH + 16 }]}
        >
          <Glass style={styles.recenterFill}>
            <Icon name="locate" size={22} color={colors.text} />
          </Glass>
        </Pressable>
      ) : null}

      <BottomSheet
        ref={sheet}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        bottomInset={tabH}
        onChange={(i) => setSheetOpen(i >= 0)}
        onClose={() => setSelectedId(undefined)}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        style={styles.sheetShadow}
      >
        <BottomSheetView onLayout={(e) => setPeekH(e.nativeEvent.layout.height + 24)}>
          {list.length ? (
            <FlatList
              ref={pager}
              data={list}
              keyExtractor={(i) => i.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              getItemLayout={(_, index) => ({ length: screen.width, offset: screen.width * index, index })}
              initialScrollIndex={Math.max(0, selIndex)}
              onMomentumScrollEnd={onPage}
              renderItem={({ item, index }) => (
                <IsoPeek
                  iso={item}
                  width={screen.width}
                  counter={list.length > 1 ? `${index + 1} of ${list.length}` : undefined}
                  reasons={pill === 'recommended' ? item.recommendation?.reasons : undefined}
                  onPrev={list.length > 1 ? () => step(-1) : undefined}
                  onNext={list.length > 1 ? () => step(1) : undefined}
                  onCoachCard={() => router.push(`/coach/${item.coachId}`)}
                  onView={() => router.push(`/iso/${item.id}`)}
                />
              )}
            />
          ) : shown ? (
            <View style={styles.empty}>
              <PathwayDot color={emptyPath ? pathwayColors[emptyPath].fill : colors.textSecondary} size={14} />
              <Text variant="rowTitle" style={styles.emptyTitle}>
                {emptyPath ? `No ${pathwayName(emptyPath)} ISOs this week` : 'No pins from coaches you follow'}
              </Text>
              <Text variant="subtitle" align="center">
                Follow coaches in this pathway and you’ll get pinged the moment one drops a pin.
              </Text>
              <Button label="Browse coaches" variant="outline" height={TAP} onPress={() => router.push('/coaches')} />
            </View>
          ) : null}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { position: 'absolute', top: 0, left: 0, right: 0, gap: 8, paddingBottom: 10 },
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mark: { width: 36, height: 28 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: gutter },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: TAP,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
  },
  areaText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  pills: { gap: 8, paddingHorizontal: gutter },
  recenter: { position: 'absolute', right: 16, width: 48, height: 48, borderRadius: 24, overflow: 'hidden', ...raisedShadow },
  recenterFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sheetBg: { backgroundColor: colors.surface1, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet },
  sheetShadow: raisedShadow,
  handle: { width: 40, height: 4, backgroundColor: colors.surface3 },
  empty: { alignItems: 'center', gap: 8, paddingTop: 8, paddingBottom: 24, paddingHorizontal: gutter + 8 },
  emptyTitle: { fontSize: 16 },
});
