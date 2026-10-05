import { Redirect, Tabs } from 'expo-router';

import { TabBar, type TabItems } from '@/components';
import { useAppStore } from '@/store';
import { colors } from '@/theme';

const coachTabs: TabItems = {
  manage: { label: 'My ISOs', icon: 'pin' },
  'coach-events': { label: 'Events', icon: 'calendar' },
  players: { label: 'Players', icon: 'users' },
  dashboard: { label: 'Dashboard', icon: 'dashboard' },
};

export default function CoachTabsLayout() {
  const approved = useAppStore((s) => s.coachStatus === 'approved');
  if (!approved) return <Redirect href="/map" />;
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} items={coachTabs} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="manage" />
      <Tabs.Screen name="coach-events" />
      <Tabs.Screen name="players" />
      <Tabs.Screen name="dashboard" />
    </Tabs>
  );
}
