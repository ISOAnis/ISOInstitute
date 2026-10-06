import { LinearGradient } from 'expo-linear-gradient';
import { Fragment } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { Coach } from '@/data';
import { pathwayName } from '@/lib/pathway';
import { alpha, cardTint, colors, fonts, pathwayColors, radius, tracking } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

/**
 * The collectible coach card: soft pathway tint, gold Overall, pathway mark,
 * watermark, photo, name, credentials and tags.
 */
export function CoachCardFull({ coach }: { coach: Coach }) {
  const p = pathwayColors[coach.pathway];
  const t = cardTint(coach.pathway);

  return (
    <View
      accessible
      accessibilityLabel={`Coach card: ${coach.name}, ${coach.pathway}, ${coach.overall} Overall`}
      style={[styles.shadow, { shadowColor: p.fill }]}
    >
      <LinearGradient colors={t.gradient} locations={[0, 0.48, 1]} style={styles.card}>
        <View style={[styles.topBar, { backgroundColor: t.topBar, shadowColor: p.fill }]} />
        <Text style={[styles.watermark, { color: t.watermark }]} numberOfLines={1} adjustsFontSizeToFit>
          {coach.pathway.toUpperCase()}
        </Text>

        <View style={styles.header}>
          <View style={styles.center}>
            <Text style={styles.overall} color={colors.gold}>
              {coach.overall}
            </Text>
            <Text variant="caption">Overall</Text>
          </View>
          <View style={[styles.center, { gap: 6 }]}>
            <View style={[styles.mark, { backgroundColor: t.iconBg }]}>
              <Icon name={coach.pathway} size={26} color={p.text} />
            </View>
            <Text variant="caption" color={p.text} style={styles.bold}>
              {pathwayName(coach.pathway)}
            </Text>
          </View>
        </View>

        <View style={styles.photo}>
          {coach.photo ? (
            <>
              <Image source={coach.photo} style={styles.photoImg} resizeMode="cover" accessibilityIgnoresInvertColors />
              <LinearGradient colors={[alpha(t.photoFade, 0), t.photoFade]} locations={[0.55, 1]} style={StyleSheet.absoluteFill} pointerEvents="none" />
            </>
          ) : (
            <Svg width={190} height={200} viewBox="0 0 190 200">
              <Circle cx={95} cy={56} r={34} fill={colors.surface3} />
              <Path d="M20 200c4-62 34-92 75-92s71 30 75 92z" fill={colors.surface3} />
            </Svg>
          )}
        </View>

        <Text style={styles.name}>{coach.name}</Text>
        <Text variant="body" color={colors.textSecondary}>
          {coach.subtitle}
        </Text>

        <View style={styles.divider} />

        <View style={styles.creds}>
          {coach.credentials.map((c, i) => (
            <Fragment key={c.label}>
              {i > 0 ? <View style={styles.credRule} /> : null}
              <View style={styles.cred}>
                <Text style={styles.credValue} numberOfLines={1} adjustsFontSizeToFit>
                  {c.value}
                </Text>
                <Text variant="caption" align="center">
                  {c.label}
                </Text>
              </View>
            </Fragment>
          ))}
        </View>

        <View style={styles.tags}>
          {coach.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text variant="caption" color={colors.text}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <Text variant="eyebrow" style={styles.footer}>
          ISO · The Assist
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: radius.card,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  card: {
    borderRadius: radius.card,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 0,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  watermark: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 28,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 92,
    lineHeight: 100,
    letterSpacing: tracking(0.02, 92),
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  bold: { fontFamily: fonts.bold },
  overall: { fontFamily: fonts.display, fontSize: 64, lineHeight: 70 },
  mark: {
    width: 50,
    height: 50,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    height: 230,
    marginTop: 4,
    borderRadius: radius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  photoImg: { width: '100%', height: '100%' },
  name: {
    marginTop: 14,
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: tracking(0.03, 40),
    textTransform: 'uppercase',
    color: colors.text,
  },
  divider: { height: 1, marginVertical: 16, backgroundColor: colors.hairline },
  creds: { flexDirection: 'row', alignItems: 'stretch' },
  cred: { flex: 1, alignItems: 'center', gap: 2, paddingHorizontal: 4 },
  credRule: { width: 1, backgroundColor: colors.hairline },
  credValue: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.text },
  tags: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: alpha(colors.text, 0.06),
  },
  footer: { marginTop: 16 },
});
