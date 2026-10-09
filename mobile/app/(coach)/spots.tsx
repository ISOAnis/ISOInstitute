import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Glass, IconButton, Text, useTabBarHeight, Wordmark } from '@/components';
import { getCoachVenues, useData, type VenueType } from '@/data';
import { MapCanvas } from '@/features/map/MapCanvas';
import type { MapCanvasHandle } from '@/features/map/types';
import { colors, fonts, gutter, radius } from '@/theme';

const mark = require('../../assets/iso-mark.png');

const TYPE_LABEL: Record<VenueType, string> = { cafe: 'Café', coworking: 'Coworking', library: 'Library', gym: 'Gym', restaurant: 'Restaurant' };

/** Coach map: every ISO Partner spot. Tap one to drop a pin there. */
export default function CoachSpots() {
  const insets = useSafeAreaInsets();
  const tabH = useTabBarHeight();
  const venues = useData(getCoachVenues, []).data ?? [];
  const [selectedId, setSelectedId] = useState<string>();
  const [headerH, setHeaderH] = useState(insets.top + 96);

  const map = useRef<MapCanvasHandle>(null);
  const framed = useRef(false);

  useEffect(() => {
    if (!venues.length || framed.current) return;
    framed.current = true;
    map.current?.fitTo(
      venues.map((v) => ({ latitude: v.lat, longitude: v.lng })),
      { top: headerH + 40, bottom: tabH + 40, left: 40, right: 40 },
    );
  }, [venues, headerH, tabH]);

  const venue = venues.find((v) => v.id === selectedId);
  const tables = venue ? `Room for ${venue.maxTables} ${venue.maxTables === 1 ? 'ISO' : 'ISOs'} at a time` : '';

  return (
    <View style={styles.root}>
      <MapCanvas
        ref={map}
        venues={venues}
        selectedVenueId={selectedId}
        onSelectVenue={setSelectedId}
        onPressMap={selectedId ? () => setSelectedId(undefined) : undefined}
        padding={{ top: headerH, bottom: tabH, left: 0, right: 0 }}
      />

      <Glass style={[styles.header, { paddingTop: insets.top + 6 }]} onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
        <View style={styles.brandRow}>
          <View style={styles.lockup}>
            <Image source={mark} style={styles.mark} resizeMode="contain" />
            <Wordmark size={30} />
          </View>
        </View>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong">Partner spots</Text>
          <Text variant="caption">{venues.length} verified spots across the Denver metro. Tap one to drop a pin there.</Text>
        </View>
      </Glass>

      {venue ? (
        <View style={[styles.cardWrap, { bottom: tabH + 12 }]}>
          <Card style={styles.card}>
            <View style={styles.cardHead}>
              {venue.photo ? <Image source={venue.photo} style={styles.photo} accessibilityIgnoresInvertColors /> : null}
              <View style={styles.flex}>
                <Text variant="caption" color={colors.gold} style={styles.bold}>
                  {TYPE_LABEL[venue.type]} · {venue.areaName}
                  {venue.distanceMi !== undefined ? ` · ${venue.distanceMi} mi` : ''}
                </Text>
                <Text variant="bodyStrong">{venue.name}</Text>
                <Text variant="caption">{venue.notes}</Text>
              </View>
              <IconButton icon="close" label="Close" onPress={() => setSelectedId(undefined)} />
            </View>
            <Text variant="caption" color={colors.text}>
              {tables}
            </Text>
            <Button label="Drop a pin here" icon="plus" height={52} onPress={() => router.push({ pathname: '/drop-pin', params: { venue: venue.id } })} />
          </Card>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { position: 'absolute', top: 0, left: 0, right: 0, gap: 6, paddingBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: gutter, minHeight: 44 },
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mark: { width: 36, height: 28 },
  titleRow: { paddingHorizontal: gutter, gap: 2 },
  cardWrap: { position: 'absolute', left: gutter, right: gutter },
  card: { gap: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  photo: { width: 56, height: 56, borderRadius: radius.md },
  flex: { flex: 1, gap: 2 },
  bold: { fontFamily: fonts.bold },
});
