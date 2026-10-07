import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Chip, Field, Screen, Text, TopBar } from '@/components';
import { getAreas, getMe, STAGE_OPTIONS, useData } from '@/data';
import { useAppStore } from '@/store';
import { statusColors } from '@/theme';

/** "Complete onboarding": the basics every player card needs. Unlocks "Refine your ISO profile". */
export default function ProfileBasics() {
  const me = useData(getMe, []).data;
  const areas = useData(getAreas, []).data ?? [];
  const updateBasics = useAppStore((s) => s.updateBasics);

  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!me) return;
    setName(me.name === '[Your name]' ? '' : me.name);
    setNeighborhood(me.neighborhood);
    setStage(me.stage);
  }, [me]);

  const save = async () => {
    try {
      await updateBasics({ name, neighborhood, stage });
      router.replace({ pathname: '/profile/refine', params: { who: 'player', fresh: '1' } });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      <View style={styles.group}>
        <Text variant="eyebrow">Step 1 of 2</Text>
        <Text variant="titleLg">Complete onboarding</Text>
        <Text variant="subtitle">The basics coaches see when you say “I got next.”</Text>
      </View>

      <Field label="Your name" value={name} onChangeText={setName} placeholder="First and last" autoCapitalize="words" textContentType="name" />

      <View style={styles.group}>
        <Text variant="section">Where you’d pull up from</Text>
        <View style={styles.chips}>
          {areas.map((a) => (
            <Chip key={a} label={a} active={neighborhood === a} onPress={() => setNeighborhood(a)} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text variant="section">Where you’re at right now</Text>
        <View style={styles.chips}>
          {STAGE_OPTIONS.map((o) => (
            <Chip key={o} label={o} active={stage === o} onPress={() => setStage(o)} />
          ))}
        </View>
      </View>

      {error ? (
        <Text variant="caption" color={statusColors.bad}>
          {error}
        </Text>
      ) : null}
      <Button label="Save and continue" height={52} disabled={!name.trim() || !neighborhood || !stage} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
