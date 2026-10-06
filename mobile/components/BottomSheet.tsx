import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, raisedShadow } from '@/theme';

import { Text } from './Text';

/**
 * Modal sheet that slides up over a dimmed backdrop. Used for the $5 hold,
 * late cancel, and other confirm steps. Tap the backdrop to dismiss.
 */
export function BottomSheet({
  visible,
  onClose,
  eyebrow,
  eyebrowColor = colors.textSecondary,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  eyebrow?: string;
  eyebrowColor?: string;
  title?: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [progress] = useState(() => new Animated.Value(0));
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 280 : 200,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [480, 0] });

  return (
    <Modal transparent visible={mounted} onRequestClose={onClose} statusBarTranslucent animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: progress }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
      </Animated.View>
      <View style={styles.anchor} pointerEvents="box-none">
        <Animated.View accessibilityViewIsModal style={[styles.sheet, { paddingBottom: Math.max(34, insets.bottom + 12), transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          {eyebrow ? (
            <Text variant="eyebrow" color={eyebrowColor}>
              {eyebrow}
            </Text>
          ) : null}
          {title ? (
            <Text variant="sheetTitle" style={styles.title}>
              {title}
            </Text>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: colors.backdrop },
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface1,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    ...raisedShadow,
    paddingTop: 12,
    paddingHorizontal: 20,
    gap: 14,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface3,
    marginBottom: 6,
  },
  title: { marginTop: -4 },
});
