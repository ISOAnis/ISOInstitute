import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Field, Icon, Text } from '@/components';
import { now, updateProfile } from '@/data';
import { OnboardingHeader } from '@/features/OnboardingHeader';
import { useAppStore } from '@/store';
import { colors, gutter, radius, statusColors } from '@/theme';

type Role = 'player' | 'coach';

const roles: { id: Role; title: string; body: string }[] = [
  { id: 'player', title: 'Play', body: 'Join ISO as a player. Call your ISO, rise to the challenge.' },
  { id: 'coach', title: 'Coach', body: 'Join ISO as a coach. Host ISOs, pull as you climb.' },
];

/** MM/DD/YYYY → age in whole years, or null when the date isn't valid. */
function ageFrom(birthday: string): number | null {
  const m = birthday.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [mo, d, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  if (date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  const today = now();
  let age = today.getFullYear() - y;
  if (today.getMonth() < mo - 1 || (today.getMonth() === mo - 1 && today.getDate() < d)) age -= 1;
  return age;
}

/** Onboard1: role, then name, phone, city, birthday (18+). */
export default function RoleStep() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<Role>('player');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Denver');
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');
  const coachStatus = useAppStore((s) => s.coachStatus);
  const enterApp = useAppStore((s) => s.enterApp);

  const submit = async () => {
    if (!name.trim()) return setError('Add your first name.');
    if (phone.replace(/\D/g, '').length < 10) return setError('Add a phone number we can verify.');
    const age = ageFrom(birthday);
    if (age === null) return setError('Birthday should look like 04/18/2001.');
    if (age < 18) return setError('ISOs are 18+. Come back on your 18th birthday.');
    await updateProfile({ name: name.trim(), phone, city: city.trim() || 'Denver', birthday });
    if (role === 'coach' && coachStatus === 'approved') {
      enterApp('coach');
      router.replace('/spots');
      return;
    }
    router.push(role === 'coach' ? '/coach-cohorts' : '/onboarding/pathway');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <OnboardingHeader step={1} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <Text variant="titleLg">You’re not lost. You’re in search of.</Text>

        <Text variant="section">I’m here to</Text>
        <View style={styles.roles}>
          {roles.map((r) => {
            const active = role === r.id;
            return (
              <Pressable
                key={r.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={r.title}
                onPress={() => setRole(r.id)}
                style={[styles.role, active && styles.roleActive]}
              >
                <View style={styles.roleHead}>
                  <Text variant="cardTitle">{r.title}</Text>
                  {active ? <Icon name="check" size={18} color={colors.text} /> : null}
                </View>
                <Text variant="caption">{r.body}</Text>
              </Pressable>
            );
          })}
        </View>

        <Field label="First name" value={name} onChangeText={setName} autoComplete="given-name" textContentType="givenName" />
        <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
        <Field label="City" value={city} onChangeText={setCity} textContentType="addressCity" />
        <Field label="Birthday" value={birthday} onChangeText={setBirthday} placeholder="MM/DD/YYYY" keyboardType="numbers-and-punctuation" />

        <Text variant="caption">ISOs are 18+ and happen only at verified ISO Partner spots. Real names and verified phones keep every ISO safe.</Text>
        {error ? (
          <Text variant="caption" color={statusColors.bad}>
            {error}
          </Text>
        ) : null}
        <Button label={role === 'coach' ? 'Continue to coach application' : 'Continue'} height={52} onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: gutter, gap: 16 },
  roles: { flexDirection: 'row', gap: 10 },
  role: {
    flex: 1,
    padding: 16,
    gap: 6,
    borderRadius: radius.card,
    backgroundColor: colors.surface1,
  },
  roleActive: { backgroundColor: colors.surface3 },
  roleHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
