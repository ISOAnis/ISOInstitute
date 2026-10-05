import { StyleSheet, View } from 'react-native';

import type { PathwayId } from '@/data';
import { colors, fonts, pathwayColors } from '@/theme';

import { Text } from './Text';

/** Initials disc. With `pathway`, adds a ring in that pathway's color. */
export function Avatar({
  initials,
  size = 40,
  pathway,
  ringColor,
  bg = colors.avatar,
  ink = colors.textBody,
  dashed,
}: {
  initials: string;
  size?: number;
  pathway?: PathwayId;
  ringColor?: string;
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
          backgroundColor: dashed ? 'transparent' : bg,
          borderWidth: ring || dashed ? 2 : 0,
          borderColor: ring ?? colors.borderButton,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
      ]}
    >
      <Text style={{ fontFamily: fonts.extrabold, fontSize: Math.round(size * 0.32) }} color={ink}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  disc: { alignItems: 'center', justifyContent: 'center' },
});
