import { useImperativeHandle, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { pathwayName } from '@/lib/pathway';
import { alpha, mapColors, pathwayColors } from '@/theme';

import { AREA_RADIUS_M, DENVER_METRO, displayPoint } from './geo';
import { DOT_BOX, IsoDot } from './IsoDot';
import type { LatLng, MapCanvasProps, Region } from './types';

const M_PER_DEG_LAT = 111_000;

/**
 * Web preview only. react-native-maps has no web build, so the browser gets a
 * flat projection of the same fuzzed points with the same selection and camera
 * behavior. iOS and Android render the real map in MapCanvas.tsx.
 */
export function MapCanvas({ ref, isos, visibleIds, selectedId, onSelectIso, onPressMap, initialRegion = DENVER_METRO }: MapCanvasProps) {
  const [size, setSize] = useState({ w: 390, h: 844 });
  const [region, setRegion] = useState<Region>(initialRegion);

  useImperativeHandle(ref, () => ({
    animateToRegion: (r) => setRegion(r),
    fitTo: (points: LatLng[]) => {
      if (!points.length) return;
      const lats = points.map((p) => p.latitude);
      const lngs = points.map((p) => p.longitude);
      const latitudeDelta = Math.max(0.25, (Math.max(...lats) - Math.min(...lats)) * 2.2);
      setRegion({
        latitude: (Math.max(...lats) + Math.min(...lats)) / 2 - latitudeDelta * 0.12,
        longitude: (Math.max(...lngs) + Math.min(...lngs)) / 2,
        latitudeDelta,
        longitudeDelta: latitudeDelta,
      });
    },
  }));

  const lngSpan = (region.latitudeDelta * (size.w / size.h)) / Math.cos((region.latitude * Math.PI) / 180);
  const project = (p: LatLng) => ({
    x: ((p.longitude - (region.longitude - lngSpan / 2)) / lngSpan) * size.w,
    y: ((region.latitude + region.latitudeDelta / 2 - p.latitude) / region.latitudeDelta) * size.h,
  });
  const pxPerM = size.h / (region.latitudeDelta * M_PER_DEG_LAT);
  const selected = isos.find((i) => i.id === selectedId);

  return (
    <Pressable
      style={styles.frame}
      onPress={onPressMap}
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      accessibilityLabel="Map of ISOs across the Denver metro"
    >
      {selected
        ? (() => {
            const c = project(displayPoint(selected));
            const r = AREA_RADIUS_M * pxPerM;
            const fill = pathwayColors[selected.pathway].fill;
            return (
              <View
                pointerEvents="none"
                style={[
                  styles.abs,
                  {
                    left: c.x - r,
                    top: c.y - r,
                    width: r * 2,
                    height: r * 2,
                    borderRadius: r,
                    backgroundColor: alpha(fill, 0.1),
                    borderColor: alpha(fill, 0.4),
                  },
                  styles.area,
                ]}
              />
            );
          })()
        : null}
      {isos.map((iso) => {
        const c = project(displayPoint(iso));
        return (
          <Pressable
            key={iso.id}
            accessibilityRole="button"
            accessibilityLabel={`${pathwayName(iso.pathway)} ISO: ${iso.title}, ${iso.areaName}`}
            onPress={() => onSelectIso?.(iso.id)}
            style={[styles.abs, { left: c.x - DOT_BOX / 2, top: c.y - DOT_BOX / 2, zIndex: iso.id === selectedId ? 3 : 2 }]}
          >
            <IsoDot
              pathway={iso.pathway}
              selected={iso.id === selectedId}
              dimmed={visibleIds ? !visibleIds.has(iso.id) : false}
              full={iso.seatsOpen === 0 || iso.status === 'full'}
            />
          </Pressable>
        );
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: { ...StyleSheet.absoluteFill, overflow: 'hidden', backgroundColor: mapColors.land, cursor: 'auto' },
  abs: { position: 'absolute' },
  area: { borderWidth: 1 },
});
