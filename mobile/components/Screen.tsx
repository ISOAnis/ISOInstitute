import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, gutter } from '@/theme';

/** Dark full-screen container with safe-area top padding. */
export function Screen({ children, scroll = true, contentStyle }: { children: ReactNode; scroll?: boolean; contentStyle?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  const pad = [styles.content, { paddingTop: insets.top + 8 }, contentStyle];
  return (
    <View style={styles.root}>
      {scroll ? (
        <ScrollView contentContainerStyle={pad} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[pad, styles.fill]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: gutter, paddingBottom: 40, gap: 28 },
  fill: { flex: 1 },
});
