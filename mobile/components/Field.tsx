import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

/** Labeled text input. */
export function Field({ label, multiline, style, ...rest }: TextInputProps & { label?: string }) {
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="caption" color={colors.textMuted} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textDisabled}
        selectionColor={colors.gold}
        multiline={multiline}
        accessibilityLabel={label ?? rest.placeholder}
        {...rest}
        style={[styles.input, multiline && styles.multi, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontFamily: fonts.bold },
  input: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderChip,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  multi: { minHeight: 92, paddingTop: 12, textAlignVertical: 'top' },
});
