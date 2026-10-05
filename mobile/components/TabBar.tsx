import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, layout } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type TabItems = Record<string, { label: string; icon: IconName }>;

/** App tab bar. Routes not listed in `items` are hidden. */
export function TabBar({ state, navigation, items }: BottomTabBarProps & { items: TabItems }) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.bar, { paddingBottom: bottom, minHeight: layout.tabBarHeight }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const item = items[route.name];
        if (!item) return null;
        const focused = state.index === index;
        const tint = focused ? colors.gold : colors.textDim;

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
            onPress={onPress}
            style={styles.tab}
          >
            <Icon name={item.icon} size={24} color={tint} />
            <Text style={[styles.label, { fontFamily: focused ? fonts.extrabold : fonts.semibold }]} color={tint}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.bgRaised,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: 8,
  },
  tab: { minWidth: 64, minHeight: 44, alignItems: 'center', gap: 3 },
  label: { fontSize: 11 },
});
