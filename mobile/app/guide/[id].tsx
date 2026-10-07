import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card, Icon, Screen, Text, TopBar } from '@/components';
import { getIso, useData } from '@/data';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, pathwayColors, radius } from '@/theme';

const SHARED = 'Everyone at this ISO knows about the Guide. Using it out loud is normal. Nobody has to perform.';

/** Prompts for the host, or a way in for a confirmed player. */
export default function Guide() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const myCoachId = useAppStore((s) => s.coachId);
  const mine = useAppStore((s) => s.seats[id]);
  const iso = useData(() => getIso(id), [id]).data;

  if (!iso) return <Screen>{null}</Screen>;

  const hosting = iso.coachId === myCoachId;
  const confirmed = mine?.status === 'confirmed' || mine?.status === 'checked_in';
  const name = pathwayName(iso.pathway);
  const p = pathwayColors[iso.pathway];

  if (!hosting && !confirmed) {
    return (
      <Screen>
        <TopBar onBack={() => router.back()} label="The Guide" />
        <View style={styles.locked}>
          <Icon name="lock" size={28} color={colors.textSecondary} />
          <Text variant="rowTitle" align="center">
            The Guide opens once you’re in
          </Text>
          <Text variant="subtitle" align="center">
            Say “I got next” and it shows up after {iso.coach.firstName} confirms you.
          </Text>
        </View>
      </Screen>
    );
  }

  const sections = hosting ? coachSections(name) : playerSections(name);

  return (
    <Screen>
      <TopBar onBack={() => router.back()} label="The Guide" />
      <View style={styles.group}>
        <Text variant="eyebrow" color={p.text}>
          {name} · {hosting ? 'For the coach' : 'For you'}
        </Text>
        <Text variant="titleLg">{hosting ? 'Run the room' : 'Walk in ready'}</Text>
        <Text variant="subtitle">{SHARED}</Text>
      </View>

      {sections.map((s, i) => (
        <Card key={s.title}>
          <Text style={styles.num} color={colors.gold}>
            {i + 1}
          </Text>
          <Text variant="cardTitle">{s.title}</Text>
          <Text variant="body">{s.body}</Text>
          {s.prompt ? (
            <View style={styles.prompt}>
              <Text variant="bodyStrong">“{s.prompt}”</Text>
            </View>
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}

function coachSections(pathway: string) {
  return [
    {
      title: 'Open the room',
      body: 'Give it two minutes before the real talk. Say your name, the pathway, and why you pulled up. Then go around once: a name, and one thing they’re in the middle of.',
    },
    {
      title: 'Get to know them',
      body: `Ask about the person, not the pitch. Where they grew up, who they look up to, what a normal Tuesday looks like. ${pathway} talk lands better once you know who you’re with.`,
      prompt: 'What’s a normal Tuesday look like for you?',
    },
    {
      title: 'Find out what they want',
      body: 'Ask it plain. If they’re timid, offer three lanes: a story from you, a problem to work, or a question they’ve been sitting on.',
      prompt: 'What would make this hour worth it for you?',
    },
    {
      title: 'If it gets quiet',
      body: 'Name it. Say you’re using the Guide, then hand the room one question. Silence after that is fine. Wait.',
      prompt: 'What’s the part you don’t say out loud yet?',
    },
  ];
}

function playerSections(pathway: string) {
  return [
    {
      title: 'The first few minutes',
      body: `You’ll sit down, say your name, and hear everyone else’s. You don’t need a ${pathway} story ready. The coach opens the room.`,
    },
    {
      title: 'Say what you want',
      body: 'One line is enough. If that’s too much, saying you want to listen first is a complete answer.',
      prompt: 'I want help with…',
    },
    {
      title: 'If you freeze',
      body: 'Say you want to use the Guide. The coach has questions ready. That’s the point, and you won’t be the only one who needs a prompt.',
      prompt: 'Can we use the Guide?',
    },
    {
      title: 'It’s low stakes',
      body: 'One coach, a few players, no performance. You’re not being graded. Showing up is the work.',
    },
  ];
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 12 },
  num: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32 },
  prompt: { padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface2 },
});
