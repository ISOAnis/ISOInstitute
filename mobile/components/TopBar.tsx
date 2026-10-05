import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { TAP } from '@/theme';

import { IconButton } from './IconButton';
import { Text } from './Text';

/** Back button, centered label, optional right action. */
export function TopBar({ label, right, onBack }: { label?: string; right?: ReactNode; onBack?: () => void }) {
  return (
    <View style={styles.bar}>
      <IconButton icon="back" label="Back" onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))} />
      {label ? <Text variant="topLabel">{label}</Text> : <View />}
      {right ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: TAP },
});
