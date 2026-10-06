import { Tabs } from 'expo-router';

import { TabBar, type TabItems } from '@/components';
import { useAppStore } from '@/store';
import { colors } from '@/theme';

const playerTabs: TabItems = {
  map: { label: 'Map', icon: 'pin' },
  events: { label: 'Events', icon: 'calendar' },
  coaches: { label: 'Coaches', icon: 'users' },
  me: { label: 'Me', icon: 'user' },
};

/** Approved coaches in player mode explore every pathway instead of the map. */
const coachPlayerTabs: TabItems = { ...playerTabs, map: { label: 'Explore', icon: 'search' } };

export default function PlayerTabsLayout() {
  const isCoach = useAppStore((s) => s.coachStatus === 'approved');
  const items = isCoach ? coachPlayerTabs : playerTabs;
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} items={items} floatOn={isCoach ? [] : ['map']} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="map" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="coaches" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}
