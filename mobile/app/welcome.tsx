import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components';
import { useAppStore } from '@/store';
import { colors, fonts, gutter, tracking } from '@/theme';

const mark = require('../assets/iso-mark.png');

/** Logo + "You're not lost" intro, then the tagline and Sign up / Log in. */
export default function Welcome() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [t] = useState(() => new Animated.Value(0));
  const [run, setRun] = useState(0);

  useEffect(() => {
    t.setValue(0);
    const anim = Animated.sequence([
      Animated.delay(1800),
      Animated.timing(t, { toValue: 1, duration: 900, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [t, run]);

  const logo = {
    transform: [
      { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -120] }) },
      { scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.72] }) },
    ],
  };
  const intro = { opacity: t.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0], extrapolate: 'clamp' }) };
  const ready = {
    opacity: t.interpolate({ inputRange: [0.4, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
  };

  const logIn = () => {
    completeOnboarding();
    router.replace('/map');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}>
      <View style={styles.stage}>
        <Animated.View style={logo}>
          <Pressable accessibilityRole="button" accessibilityLabel="ISO logo, tap to replay intro" onPress={() => setRun((r) => r + 1)}>
            <Image source={mark} style={styles.mark} resizeMode="contain" />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.intro, intro]} pointerEvents="none">
          <Text style={styles.introText} align="center">
            You’re not lost.{'\n'}You’re in search of.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.ready, ready]}>
          <View style={styles.wordRow}>
            <Text style={styles.word}>ISO</Text>
            <Text style={styles.wordSub} color={colors.textMuted}>
              IN SEARCH OF
            </Text>
          </View>
          <Text style={styles.tagline} align="center">
            Where culture, community,{'\n'}and <Text style={styles.tagline} color={colors.gold}>ambition</Text> intersect.
          </Text>
          <Text variant="subtitle" align="center" style={styles.sub}>
            Community coaching, in person, with people who’ve already done what you’re trying to do.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.actions, ready]}>
        <Button label="Sign up" height={52} onPress={() => router.push('/onboarding/role')} />
        <Button label="Log in" variant="outline" height={52} onPress={logIn} />
        <Text variant="tiny" align="center">
          By continuing you agree to ISO’s Terms and Privacy Policy.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: gutter },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mark: { width: 168, height: 130 },
  intro: { position: 'absolute', top: '58%', left: 0, right: 0 },
  introText: { fontFamily: fonts.display, fontSize: 46, lineHeight: 46, color: colors.text },
  ready: { position: 'absolute', top: '42%', left: 0, right: 0, alignItems: 'center', gap: 10 },
  wordRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  word: { fontFamily: fonts.display, fontSize: 40, letterSpacing: tracking(0.06, 40), color: colors.textBody },
  wordSub: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: tracking(0.22, 11) },
  tagline: { fontFamily: fonts.display, fontSize: 34, lineHeight: 35, color: colors.text, marginTop: 12 },
  sub: { paddingHorizontal: 16 },
  actions: { gap: 10 },
});
