import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { Coach } from '@/data';
import { alpha, cardTint, colors, fonts, pathwayColors, radius, tracking } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

/**
 * The collectible coach card: pathway-tinted, big Overall, pathway mark,
 * watermark, cutout photo, name, credentials and tags.
 */
export function CoachCardFull({ coach }: { coach: Coach }) {
  const p = pathwayColors[coach.pathway];
  const t = cardTint(coach.pathway);
  const pathLabel = coach.pathway.toUpperCase();

  return (
    <View
      accessible
      accessibilityLabel={`Coach card: ${coach.name}, ${coach.pathway}, ${coach.overall} Overall`}
      style={[styles.shadow, { shadowColor: p.fill }]}
    >
      <LinearGradient
        colors={t.gradient}
        locations={[0, 0.48, 1]}
        style={[styles.card, { borderColor: t.border }]}
      >
        <View style={[styles.topBar, { backgroundColor: t.topBar, shadowColor: p.fill }]} />
        <Text style={[styles.watermark, { color: t.watermark }]} numberOfLines={1} adjustsFontSizeToFit>
          {pathLabel}
        </Text>

        <View style={styles.header}>
          <View style={styles.center}>
            <Text style={styles.overall}>{coach.overall}</Text>
            <Text style={styles.overallLabel} color={colors.textMuted}>
              OVERALL
            </Text>
          </View>
          <View style={[styles.center, { gap: 6 }]}>
            <View style={[styles.mark, { backgroundColor: t.iconBg, borderColor: t.iconBorder }]}>
              <Icon name={coach.pathway} size={26} color={p.text} />
            </View>
            <Text style={styles.markLabel} color={p.text}>
              {pathLabel}
            </Text>
          </View>
        </View>

        <View style={styles.photo}>
          {coach.photoUrl ? (
            <Image source={{ uri: coach.photoUrl }} style={styles.photoImg} resizeMode="contain" />
          ) : (
            <>
              <Svg width={190} height={200} viewBox="0 0 190 200">
                <Circle cx={95} cy={56} r={34} fill={t.silhouette} />
                <Path d="M20 200c4-62 34-92 75-92s71 30 75 92z" fill={t.silhouette} />
              </Svg>
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText} color={colors.textDim}>
                  [COACH CUTOUT PHOTO]
                </Text>
              </View>
            </>
          )}
        </View>

        <Text style={styles.name}>{coach.name}</Text>
        <Text style={styles.subtitle} color={colors.textDim}>
          {coach.subtitle}
        </Text>

        <View style={[styles.divider, { backgroundColor: t.divider }]} />

        <View style={styles.creds}>
          {coach.credentials.map((c) => (
            <View key={c.label} style={[styles.cred, { borderColor: t.border }]}>
              <Text style={styles.credValue} color={c.highlight ? colors.gold : colors.text} numberOfLines={1} adjustsFontSizeToFit>
                {c.value}
              </Text>
              <Text style={styles.credLabel} color={colors.textDim} align="center">
                {c.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.tags}>
          {coach.tags.map((tag) => (
            <View key={tag} style={[styles.tag, { borderColor: t.tagBorder }]}>
              <Text style={styles.tagText} color={colors.textDim}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer} color={t.footer}>
          ISO · THE ASSIST
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: radius.card,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 0,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 7,
  },
  watermark: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 96,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 92,
    lineHeight: 92,
    letterSpacing: tracking(0.02, 92),
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  overall: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 60,
    color: colors.text,
    textShadowColor: alpha(colors.text, 0.25),
    textShadowRadius: 18,
  },
  overallLabel: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: tracking(0.3, 10), paddingLeft: 3 },
  mark: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markLabel: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: tracking(0.24, 10) },
  photo: { height: 210, marginTop: -8, alignItems: 'center', justifyContent: 'flex-end' },
  photoImg: { width: '100%', height: '100%' },
  photoTag: {
    position: 'absolute',
    bottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.scrim,
  },
  photoTagText: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1 },
  name: {
    marginTop: 10,
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 40,
    letterSpacing: tracking(0.03, 40),
    textTransform: 'uppercase',
    color: colors.text,
  },
  subtitle: { marginTop: 4, fontFamily: fonts.body, fontSize: 13, letterSpacing: tracking(0.04, 13) },
  divider: { height: 1, marginVertical: 14 },
  creds: { flexDirection: 'row', gap: 8 },
  cred: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: radius.xs,
    borderWidth: 1,
    backgroundColor: colors.inset,
    alignItems: 'center',
    gap: 3,
  },
  credValue: { fontFamily: fonts.display, fontSize: 19, lineHeight: 19 },
  credLabel: { fontFamily: fonts.extrabold, fontSize: 9, letterSpacing: tracking(0.14, 9) },
  tags: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.tag,
    borderWidth: 1,
    backgroundColor: colors.sheen,
  },
  tagText: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: tracking(0.14, 10) },
  footer: { marginTop: 12, fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: tracking(0.3, 11) },
});
