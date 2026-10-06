import { Image, StyleSheet, View } from 'react-native';

import type { PathwayId, Photo } from '@/data';
import { colors, fonts, pathwayColors } from '@/theme';

import { Text } from './Text';

/** Round photo, or an initials disc. With `pathway`, adds a thin ring in that pathway's color. */
export function Avatar({
  initials,
  size = 40,
  pathway,
  ringColor,
  photo,
  bg = colors.surface3,
  ink = colors.text,
  dashed,
}: {
  initials: string;
  size?: number;
  pathway?: PathwayId;
  ringColor?: string;
  photo?: Photo;
  bg?: string;
  ink?: string;
  dashed?: boolean;
}) {
  const ring = ringColor ?? (pathway ? pathwayColors[pathway].fill : undefined);
  return (
    <View
      style={[
        styles.disc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dashed ? colors.transparent : bg,
          borderWidth: ring || dashed ? 2 : 0,
          borderColor: ring ?? colors.textMeta,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
      ]}
    >
      {photo && !dashed ? (
        <Image source={photo} style={styles.photo} resizeMode="cover" accessibilityIgnoresInvertColors />
      ) : (
        <Text style={{ fontFamily: fonts.extrabold, fontSize: Math.max(13, Math.round(size * 0.32)) }} color={ink}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  disc: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
});
