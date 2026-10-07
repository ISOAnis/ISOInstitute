import { LinearGradient } from 'expo-linear-gradient';
import { Fragment, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { isRookie, type Coach } from '@/data';
import { pathwayName } from '@/lib/pathway';
import { alpha, cardTint, colors, fonts, pathwayColors, radius, tracking } from '@/theme';

import { Icon } from './Icon';
import { RookieBadge } from './RookieBadge';
import { Text } from './Text';

const STAGE_H = 270;

/**
 * The collectible coach card: soft pathway tint, gold Overall, pathway mark,
 * the coach's cutout headshot over their pathway name, credentials and tags.
 */
export function CoachCardFull({ coach }: { coach: Coach }) {
  const p = pathwayColors[coach.pathway];
  const t = cardTint(coach.pathway);
  const rookie = isRookie(coach);
  const name = pathwayName(coach.pathway);
  const [stageW, setStageW] = useState(340);
  const markSize = Math.min(150, (stageW - 24) / (name.length * 0.44));

  return (
    <View
      accessible
      accessibilityLabel={`Coach card: ${coach.name}, ${coach.pathway}, ${coach.overall} Overall${rookie ? ', rookie' : ''}`}
      style={[styles.shadow, { shadowColor: p.fill }]}
    >
      <LinearGradient colors={t.gradient} locations={[0, 0.48, 1]} style={styles.card}>
        <View style={[styles.topBar, { backgroundColor: t.topBar, shadowColor: p.fill }]} />

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

        <View style={styles.stage} onLayout={(e) => setStageW(e.nativeEvent.layout.width)}>
          <Text
            style={[styles.watermark, { color: alpha(p.fill, 0.22), fontSize: markSize, lineHeight: markSize * 1.06, letterSpacing: tracking(0.02, markSize) }]}
            numberOfLines={1}
          >
            {name}
          </Text>
          {coach.cutout ? (
            <Image source={coach.cutout} style={styles.cutout} resizeMode="contain" accessibilityIgnoresInvertColors />
          ) : (
            <Svg width={200} height={210} viewBox="0 0 190 200" style={styles.silhouette}>
              <Circle cx={95} cy={62} r={36} fill={colors.surface3} />
              <Path d="M18 200c4-62 34-94 77-94s73 32 77 94z" fill={colors.surface3} />
            </Svg>
          )}
          <LinearGradient colors={[alpha(t.photoFade, 0), t.photoFade]} style={styles.fade} pointerEvents="none" />
          {rookie ? (
            <View style={styles.rookie}>
              <RookieBadge />
            </View>
          ) : null}
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
    paddingBottom: 20,
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 },
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
  stage: { height: STAGE_H, marginTop: -28, marginHorizontal: -20, alignItems: 'center', justifyContent: 'flex-end' },
  watermark: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 46,
    textAlign: 'center',
    fontFamily: fonts.display,
    textTransform: 'uppercase',
  },
  cutout: { width: STAGE_H * 0.98, height: STAGE_H - 16 },
  silhouette: { marginBottom: 0 },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 56 },
  rookie: { position: 'absolute', left: 20, bottom: 14 },
  name: {
    marginTop: 10,
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
});
