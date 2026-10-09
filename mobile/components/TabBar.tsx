import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, raisedShadow } from '@/theme';

import { Glass } from './Glass';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type TabItems = Record<string, { label: string; icon: IconName; onLongPress?: () => void; hint?: string }>;

const CONTENT_HEIGHT = 56;

/** Total tab bar height, so floating screens can keep their controls above it. */
export function useTabBarHeight() {
  const insets = useSafeAreaInsets();
  return CONTENT_HEIGHT + Math.max(insets.bottom, 12);
}

/**
 * App tab bar. Routes not listed in `items` are hidden. On routes listed in
 * `floatOn` it floats over the screen in translucent charcoal instead of
 * taking its own space.
 */
export function TabBar({ state, navigation, items, floatOn = [] }: BottomTabBarProps & { items: TabItems; floatOn?: string[] }) {
  const insets = useSafeAreaInsets();
  const height = useTabBarHeight();
  const floating = floatOn.includes(state.routes[state.index]?.name);

  const tabs = state.routes.map((route, index) => {
    const item = items[route.name];
    if (!item) return null;
    const focused = state.index === index;
    const tint = focused ? colors.gold : colors.textSecondary;

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={item.label}
        accessibilityHint={item.hint}
        accessibilityActions={item.onLongPress ? [{ name: 'longpress', label: item.hint }] : undefined}
        onAccessibilityAction={item.onLongPress}
        onPress={onPress}
        onLongPress={item.onLongPress}
        delayLongPress={350}
        style={styles.tab}
      >
        <Icon name={item.icon} size={24} color={tint} />
        <Text style={[styles.label, { fontFamily: focused ? fonts.extrabold : fonts.semibold }]} color={focused ? colors.text : colors.textSecondary}>
          {item.label}
        </Text>
      </Pressable>
    );
  });

  const frame = [styles.bar, { height, paddingBottom: Math.max(insets.bottom, 12) }];
  if (floating) {
    return (
      <Glass style={[frame, styles.floating]} accessibilityRole="tablist">
        {tabs}
      </Glass>
    );
  }
  return (
    <View style={[frame, styles.solid]} accessibilityRole="tablist">
      {tabs}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  solid: { backgroundColor: colors.surface1, ...raisedShadow },
  floating: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  tab: { minWidth: 64, minHeight: 44, alignItems: 'center', gap: 3 },
  label: { fontSize: 13 },
});
