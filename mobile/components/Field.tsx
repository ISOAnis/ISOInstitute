import type { ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

/** Labeled text input. `required` adds a small "Required" marker beside the label. */
export function Field({ label, required, multiline, style, ...rest }: TextInputProps & { label?: string; required?: boolean }) {
  return (
    <View style={styles.wrap}>
      {label ? <FieldLabel label={label} required={required} /> : null}
      <TextInput
        placeholderTextColor={colors.textMeta}
        selectionColor={colors.gold}
        multiline={multiline}
        accessibilityLabel={label ?? rest.placeholder}
        {...rest}
        style={[styles.input, multiline && styles.multi, style]}
      />
    </View>
  );
}

/** Section label for fields and chip groups. Shows "Required" or "Optional", or a custom `right` slot such as a Skip button. */
export function FieldLabel({ label, required, optional, right }: { label: string; required?: boolean; optional?: boolean; right?: ReactNode }) {
  const marker = required ? 'Required' : optional ? 'Optional' : null;
  return (
    <View style={styles.labelRow}>
      <Text variant="section" style={styles.label}>
        {label}
      </Text>
      {right ??
        (marker ? (
          <Text variant="caption" color={colors.textMeta}>
            {marker}
          </Text>
        ) : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  label: { flexShrink: 1 },
  input: {
    minHeight: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
    paddingHorizontal: 16,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  multi: { minHeight: 92, paddingTop: 12, textAlignVertical: 'top' },
});
