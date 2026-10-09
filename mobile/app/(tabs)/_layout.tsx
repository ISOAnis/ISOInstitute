import { Tabs } from 'expo-router';
import { useState } from 'react';

import { TabBar, type TabItems } from '@/components';
import { AccountSwitcher } from '@/features/AccountSwitcher';
import { colors } from '@/theme';

export default function PlayerTabsLayout() {
  const [switching, setSwitching] = useState(false);

  const playerTabs: TabItems = {
    map: { label: 'Map', icon: 'pin' },
    events: { label: 'Events', icon: 'calendar' },
    coaches: { label: 'Coaches', icon: 'users' },
    me: { label: 'Me', icon: 'user', onLongPress: () => setSwitching(true), hint: 'Touch and hold to switch accounts' },
  };

  return (
    <>
      <Tabs
        tabBar={(props) => <TabBar {...props} items={playerTabs} floatOn={['map']} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      >
        <Tabs.Screen name="map" />
        <Tabs.Screen name="events" />
        <Tabs.Screen name="coaches" />
        <Tabs.Screen name="me" />
      </Tabs>
      <AccountSwitcher visible={switching} onClose={() => setSwitching(false)} />
    </>
  );
}
