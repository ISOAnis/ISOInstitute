import { useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import ClusteredMapView from 'react-native-map-clustering';
import type MapView from 'react-native-maps';
import { Circle, Marker } from 'react-native-maps';

import { pathwayName } from '@/lib/pathway';
import { alpha, pathwayColors } from '@/theme';

import { AREA_RADIUS_M, DENVER_METRO, displayPoint, MAX_ZOOM } from './geo';
import { ClusterBubble, IsoDot } from './IsoDot';
import { darkMapStyle } from './mapStyle';
import type { MapCanvasProps } from './types';

const CENTER = { x: 0.5, y: 0.5 };
/** react-native-map-clustering leaves markers with `cluster={false}` out of every cluster. */
const UNCLUSTERED = { cluster: false } as object;

type ClusterInfo = { id: number; geometry: { coordinates: [number, number] }; properties: { point_count: number }; onPress: () => void };

/** Apple Maps on iOS, Google Maps on Android, both in the app's dark style. */
export function MapCanvas({
  ref,
  isos,
  visibleIds,
  selectedId,
  onSelectIso,
  onPressMap,
  showsUserLocation,
  interactive = true,
  initialRegion = DENVER_METRO,
  padding,
}: MapCanvasProps) {
  const map = useRef<MapView | null>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region, duration = 450) => map.current?.animateToRegion(region, duration),
    fitTo: (points, edgePadding) => map.current?.fitToCoordinates(points, { edgePadding, animated: true }),
  }));

  const selected = isos.find((i) => i.id === selectedId);
  const ordered = [...isos].sort((a, b) => Number(visibleIds?.has(a.id) ?? 1) - Number(visibleIds?.has(b.id) ?? 1));

  return (
    <ClusteredMapView
      mapRef={(r) => {
        map.current = r as unknown as MapView | null;
      }}
      style={StyleSheet.absoluteFill}
      initialRegion={initialRegion}
      maxZoomLevel={MAX_ZOOM}
      userInterfaceStyle="dark"
      customMapStyle={Platform.OS === 'android' ? darkMapStyle : undefined}
      showsPointsOfInterests={false}
      showsBuildings={false}
      showsIndoors={false}
      showsTraffic={false}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      moveOnMarkerPress={false}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      rotateEnabled={interactive}
      pitchEnabled={false}
      mapPadding={padding}
      edgePadding={padding ? { ...padding, top: padding.top + 40, bottom: padding.bottom + 40 } : undefined}
      clusteringEnabled={interactive}
      maxZoom={MAX_ZOOM - 2}
      radius={44}
      animationEnabled={false}
      spiralEnabled={false}
      onPress={(e) => {
        if ((e.nativeEvent as { action?: string }).action === 'marker-press') return;
        onPressMap?.();
      }}
      renderCluster={(c: ClusterInfo) => (
        <Marker
          key={`cluster-${c.id}`}
          coordinate={{ latitude: c.geometry.coordinates[1], longitude: c.geometry.coordinates[0] }}
          anchor={CENTER}
          onPress={c.onPress}
          tracksViewChanges={false}
          accessibilityLabel={`${c.properties.point_count} ISOs here. Zoom in`}
        >
          <ClusterBubble count={c.properties.point_count} />
        </Marker>
      )}
    >
      {selected ? (
        <Circle
          center={displayPoint(selected)}
          radius={AREA_RADIUS_M}
          fillColor={alpha(pathwayColors[selected.pathway].fill, 0.1)}
          strokeColor={alpha(pathwayColors[selected.pathway].fill, 0.4)}
          strokeWidth={1}
        />
      ) : null}
      {ordered.map((iso) => {
        const isSelected = iso.id === selectedId;
        return (
          <Marker
            key={iso.id}
            coordinate={displayPoint(iso)}
            anchor={CENTER}
            zIndex={isSelected ? 3 : visibleIds?.has(iso.id) === false ? 1 : 2}
            stopPropagation
            tracksViewChanges={Platform.OS === 'android'}
            onPress={() => onSelectIso?.(iso.id)}
            accessibilityLabel={`${pathwayName(iso.pathway)} ISO: ${iso.title}, ${iso.areaName}`}
            {...(isSelected ? UNCLUSTERED : null)}
          >
            <IsoDot
              pathway={iso.pathway}
              selected={isSelected}
              dimmed={visibleIds ? !visibleIds.has(iso.id) : false}
              full={iso.seatsOpen === 0 || iso.status === 'full'}
            />
          </Marker>
        );
      })}
    </ClusteredMapView>
  );
}
