import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FieldLabel, Text } from '@/components';
import { colors, fonts } from '@/theme';

/** An optional question with a clear Skip. Once skipped it collapses to a note and a way back in. */
export function OptionalSection({
  label,
  on,
  onChange,
  skippedNote,
  children,
}: {
  label: string;
  on: boolean;
  onChange: (on: boolean) => void;
  skippedNote: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.group}>
      <FieldLabel
        label={label}
        right={
          on ? (
            <Pressable accessibilityRole="button" accessibilityLabel={`Skip: ${label}`} onPress={() => onChange(false)} style={styles.textBtn}>
              <Text style={styles.textBtnLabel} color={colors.gold}>
                Skip
              </Text>
            </Pressable>
          ) : undefined
        }
      />
      {on ? (
        <>
          <Text variant="caption">Optional</Text>
          {children}
        </>
      ) : (
        <View style={styles.skipped}>
          <Text variant="caption" style={styles.flex}>
            {skippedNote}
          </Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Answer: ${label}`} onPress={() => onChange(true)} style={styles.textBtn}>
            <Text style={styles.textBtnLabel} color={colors.text}>
              Answer
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1 },
  skipped: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textBtn: { minHeight: 44, justifyContent: 'center' },
  textBtnLabel: { fontFamily: fonts.bold, fontSize: 15 },
});
