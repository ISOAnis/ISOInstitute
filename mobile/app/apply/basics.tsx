import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Chip, Field, FieldLabel, Icon, Screen, Text, TopBar } from '@/components';
import { checkCoachBasics, getAreas, getCoachBasics, useData, type CoachBasics } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { useApplyContinue } from '@/features/apply/steps';
import { useAppStore } from '@/store';
import { colors, fonts, statusColors } from '@/theme';

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Step 1: name, photo, email, phone, city, neighborhood. All required. */
export default function ApplyBasics() {
  const saved = useData(getCoachBasics, []).data;
  const areas = useData(getAreas, []).data ?? [];
  const saveCoachBasics = useAppStore((s) => s.saveCoachBasics);
  const goNext = useApplyContinue('path');

  const [form, setForm] = useState<CoachBasics | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (saved && !form) setForm(saved);
  }, [saved, form]);

  if (!form) return <Screen>{null}</Screen>;

  const set = (patch: Partial<CoachBasics>) => {
    setForm({ ...form, ...patch });
    setError('');
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled && result.assets[0]) set({ photoUri: result.assets[0].uri });
  };

  const next = async () => {
    const problem = checkCoachBasics(form);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      await saveCoachBasics(form);
      goNext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar onBack={() => router.back()} />
        <ApplyProgress step="basics" />

        <View style={styles.group}>
          <Text variant="titleLg">The basics</Text>
          <Text variant="subtitle">Your name and photo go on your coach card. Your email and phone stay with the ISO team.</Text>
        </View>

        <View style={styles.group}>
          <FieldLabel label="Photo" required />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={form.photoUri ? 'Change your photo' : 'Add a photo'}
            onPress={pickPhoto}
            style={styles.photoRow}
          >
            <Avatar initials={initialsOf(form.fullName) || '+'} size={88} photo={form.photoUri ? { uri: form.photoUri } : undefined} dashed={!form.photoUri} />
            <View style={styles.flex}>
              <View style={styles.photoAction}>
                <Icon name="camera" size={18} color={colors.gold} />
                <Text style={styles.photoLabel}>{form.photoUri ? 'Change photo' : 'Add a photo'}</Text>
              </View>
              <Text variant="caption">Shows on your coach card. Your face, good light, nobody else in it.</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.fields}>
          <Field
            label="Full name"
            required
            value={form.fullName}
            onChangeText={(fullName) => set({ fullName })}
            placeholder="First and last"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
          />
          <Field
            label="Email"
            required
            value={form.email}
            onChangeText={(email) => set({ email })}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          <Field
            label="Phone"
            required
            value={form.phone}
            onChangeText={(phone) => set({ phone })}
            placeholder="(303) 555-0123"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
          />
          <Field
            label="City"
            required
            value={form.city}
            onChangeText={(city) => set({ city })}
            autoComplete="postal-address-locality"
            textContentType="addressCity"
          />
        </View>

        <View style={styles.group}>
          <FieldLabel label="Neighborhood" required />
          <View style={styles.chips}>
            {areas.map((a) => (
              <Chip key={a} label={a} active={form.neighborhood === a} onPress={() => set({ neighborhood: a })} />
            ))}
          </View>
        </View>

        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button label={saving ? 'Saving…' : 'Continue'} height={52} disabled={saving} onPress={next} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1, gap: 4 },
  group: { gap: 12 },
  fields: { gap: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 88 },
  photoAction: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  photoLabel: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
});
