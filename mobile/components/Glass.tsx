import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/theme';

/** Translucent charcoal for controls floating over the map. Real blur on iOS, a flat tint elsewhere. */
export function Glass({ style, children, ...rest }: ViewProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView tint="dark" intensity={40} style={[styles.blur, style]} {...rest}>
        {children}
      </BlurView>
    );
  }
  return (
    <View style={[styles.flat, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  blur: { overflow: 'hidden', backgroundColor: colors.glassOverBlur },
  flat: { backgroundColor: colors.glass },
});
