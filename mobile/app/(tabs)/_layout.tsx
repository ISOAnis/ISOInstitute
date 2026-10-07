import { Tabs } from 'expo-router';

import { TabBar, type TabItems } from '@/components';
import { colors } from '@/theme';

const playerTabs: TabItems = {
  map: { label: 'Map', icon: 'pin' },
  events: { label: 'Events', icon: 'calendar' },
  coaches: { label: 'Coaches', icon: 'users' },
  me: { label: 'Me', icon: 'user' },
};

export default function PlayerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} items={playerTabs} floatOn={['map']} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="map" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="coaches" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}
