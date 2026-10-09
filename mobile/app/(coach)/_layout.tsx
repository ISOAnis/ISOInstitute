import { Redirect, Tabs } from 'expo-router';
import { useState } from 'react';

import { TabBar, type TabItems } from '@/components';
import { AccountSwitcher } from '@/features/AccountSwitcher';
import { useAppStore } from '@/store';
import { colors } from '@/theme';

export default function CoachTabsLayout() {
  const approved = useAppStore((s) => s.coachStatus === 'approved');
  const [switching, setSwitching] = useState(false);
  if (!approved) return <Redirect href="/map" />;

  const coachTabs: TabItems = {
    spots: { label: 'Map', icon: 'pin' },
    manage: { label: 'My ISOs', icon: 'calendar' },
    players: { label: 'Players', icon: 'users' },
    'coach-events': { label: 'Events', icon: 'star' },
    dashboard: { label: 'Me', icon: 'user', onLongPress: () => setSwitching(true), hint: 'Touch and hold to switch accounts' },
  };

  return (
    <>
      <Tabs
        tabBar={(props) => <TabBar {...props} items={coachTabs} floatOn={['spots']} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      >
        <Tabs.Screen name="spots" />
        <Tabs.Screen name="manage" />
        <Tabs.Screen name="players" />
        <Tabs.Screen name="coach-events" />
        <Tabs.Screen name="dashboard" />
      </Tabs>
      <AccountSwitcher visible={switching} onClose={() => setSwitching(false)} />
    </>
  );
}
