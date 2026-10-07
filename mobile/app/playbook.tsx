import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Chip, ListRow, Screen, Text, TopBar } from '@/components';
import { getRanks, useData } from '@/data';
import { colors, fonts, radius } from '@/theme';

type Tab = 'Mission' | 'Lingo' | 'Ranks' | 'Overall';
const TABS: Tab[] = ['Mission', 'Lingo', 'Ranks', 'Overall'];

const LINGO = [
  {
    term: 'An ISO',
    meaning:
      'Community coaching, in person: one coach, a few players, at an ISO Partner spot tied to their pathway. You see the area and time; the exact spot comes once you’re confirmed.',
    example: '“There’s a Founder ISO at the café at noon.”',
  },
  { term: 'I got next', meaning: 'How you claim a seat at an ISO. The coach confirms.', example: '“I got next at Marcus’s ISO Tuesday.”' },
  {
    term: 'The Guide',
    meaning: 'Prompts for the coach and a way in for players, once you’re confirmed. Everyone at the ISO knows about it. Using it out loud is normal.',
    example: '“Can we use the Guide?”',
  },
  {
    term: 'Who’s in',
    meaning: 'You see seat counts on every ISO. Names of who else is coming stay private unless you’re confirmed, and only drop 24 hours before.',
    example: '“I don’t know who’s pulling up until tomorrow.”',
  },
  {
    term: 'ISO Partner',
    meaning: 'A verified local spot that hosts ISOs: cafés, gyms, coworking spaces, libraries. Members get perks there.',
    example: '“Let’s run it at the ISO Partner on Main.”',
  },
  { term: 'Coach', meaning: 'Someone who’s walked the path, approved by the ISO advisory board.', example: '“She coaches Builder ISOs on weekends.”' },
  { term: 'Player', meaning: 'Anyone growing on ISO. Coaches are players too.', example: '“I’m a Varsity player in Founder.”' },
  { term: 'Pathway', meaning: 'Your lane: Founder, Builder, Healer, Reformer, Warrior, or Seeker.', example: '“My pathway is Healer.”' },
  {
    term: 'Check-in code',
    meaning: 'Your 4-digit code once you’re confirmed. Give it to the coach when you pull up to check in. No code, no seat.',
    example: '“Code’s 4827, coach.”',
  },
  {
    term: 'The $5 hold',
    meaning:
      'Once the coach confirms your seat, a $5 hold goes on your card, not a charge. Check in and it disappears. Cancel 24+ hours out and it’s released. One late cancel a month is on us.',
    example: '“Don’t trip, the hold drops when you check in.”',
  },
  {
    term: 'Community Pool',
    meaning: 'Where no-show holds go. ISO never keeps them: the pool funds free Court tickets and gear for students.',
    example: '“No-shows paid for 14 Court tickets this month.”',
  },
  { term: 'Overall', meaning: 'A coach’s rating, built from ISOs hosted and player feedback.', example: '“He’s an 87 Overall.”' },
  {
    term: 'The Court',
    meaning: 'Big events ISO curates for each pathway: dinners, panels, competitions, co-hosted by top coaches.',
    example: '“See you on The Court Saturday.”',
  },
  { term: 'The Locker', meaning: 'Gear you’ve earned or unlocked by showing up.', example: '“Just got the patch in my Locker.”' },
  { term: 'Hall of Fame', meaning: '100 ISOs in your pathway. Your jersey gets retired.', example: '“She’s Hall of Fame. Ask her anything.”' },
];

const OVERALL = [
  { title: 'ISOs hosted', desc: 'Every ISO where players check in moves it up.' },
  { title: 'Player feedback', desc: 'Ratings and notes from players after each ISO.' },
  { title: 'Show-up rate', desc: 'Coaches who cancel or no-show drop.' },
  { title: 'The Court', desc: 'Co-hosting a curated event is a big boost.' },
];

const STANDARD = [
  { title: 'Discipline', desc: 'Show up when you said you would. Do the work between ISOs.' },
  { title: 'Humility', desc: 'Coaches serve, they don’t perform. Players listen before they speak.' },
  { title: 'Respect', desc: 'For the ISO, the space, the people, and the values ISO stands on.' },
];

const RULES = [
  'ISOs stay on the pathway: careers, skills, and the real journey.',
  'No ISO is used to push any political, social, or personal agenda.',
  'Everyone at the ISO gets the same respect. And respect the venue: everyone buys something.',
];

export default function Playbook() {
  const [tab, setTab] = useState<Tab>('Mission');
  const ladder = useData(getRanks, []).data ?? [];

  return (
    <Screen>
      <TopBar label="Settings" />
      <View>
        <Text variant="titleLg">The Playbook</Text>
        <Text variant="subtitle">How ISO talks, ranks up, and carries itself.</Text>
      </View>
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Chip key={t} label={t} active={tab === t} onPress={() => setTab(t)} />
        ))}
      </View>

      {tab === 'Mission' ? (
        <View style={styles.group}>
          <Card>
            <Text variant="eyebrow">Our mission</Text>
            <Text style={styles.mission}>Inspire ambition, elevate overlooked talent, and rebuild community pathways to success.</Text>
            <Text variant="caption">Every ISO, every coach, and every Court night exists for this.</Text>
          </Card>
          <Text variant="body" color={colors.textSecondary}>
            ISO is faith-driven in how it was built, not in what it asks of you. It’s open to everyone willing to grow by this standard.
          </Text>
          <Card style={styles.list}>
            {STANDARD.map((s, i) => (
              <ListRow key={s.title} divider={i > 0} style={styles.stack}>
                <Text variant="cardTitle">{s.title}</Text>
                <Text variant="body" color={colors.textSecondary}>
                  {s.desc}
                </Text>
              </ListRow>
            ))}
          </Card>
          <Text variant="section" style={styles.sectionTop}>
            The ISO standard
          </Text>
          {RULES.map((r) => (
            <View key={r} style={styles.rule}>
              <View style={styles.ruleDot} />
              <Text variant="body" style={styles.flex}>
                {r}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {tab === 'Lingo' ? (
        <Card style={styles.list}>
          {LINGO.map((w, i) => (
            <ListRow key={w.term} divider={i > 0} style={styles.stack}>
              <Text variant="cardTitle">{w.term}</Text>
              <Text variant="body" color={colors.textSecondary}>
                {w.meaning}
              </Text>
              <Text variant="body" style={styles.example}>
                {w.example}
              </Text>
            </ListRow>
          ))}
        </Card>
      ) : null}

      {tab === 'Ranks' ? (
        <View style={styles.group}>
          <Text variant="body">Your rank is how many ISOs you’ve checked into in your pathway. Show up, rank up.</Text>
          <Card style={styles.ladder}>
            {ladder.map((l, i) => (
              <View key={l.level} style={[styles.rung, i < ladder.length - 1 && styles.rungLine]}>
                <Text style={styles.rungNum}>{l.minIsos}</Text>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{l.level}</Text>
                  <Text variant="caption">{l.unlock}</Text>
                </View>
              </View>
            ))}
          </Card>
          <Text variant="caption">
            ISOs outside your pathway earn crossover badges. You can switch pathways once a month. Switching starts that pathway’s count; your old progress
            waits for you.
          </Text>
        </View>
      ) : null}

      {tab === 'Overall' ? (
        <View style={styles.group}>
          <Text variant="body">Every coach has an Overall. It moves with how they serve, not their résumé.</Text>
          <Card style={styles.list}>
            {OVERALL.map((o, i) => (
              <ListRow key={o.title} divider={i > 0} style={styles.stack}>
                <Text variant="bodyStrong">{o.title}</Text>
                <Text variant="caption">{o.desc}</Text>
              </ListRow>
            ))}
          </Card>
          <View style={styles.tiers}>
            {['Bronze', 'Silver', 'Gold', 'Platinum'].map((t) => (
              <View key={t} style={styles.tier}>
                <Text style={styles.tierText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  group: { gap: 14 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  stack: { flexDirection: 'column', alignItems: 'stretch', gap: 4, paddingVertical: 16 },
  sectionTop: { marginTop: 14 },
  tabs: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  mission: { fontFamily: fonts.display, fontSize: 30, lineHeight: 33, color: colors.text },
  rule: { flexDirection: 'row', gap: 10 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textSecondary, marginTop: 9 },
  example: { fontFamily: fonts.semibold, color: colors.text },
  ladder: { paddingVertical: 4, gap: 0 },
  rung: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rungLine: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  rungNum: { fontFamily: fonts.display, fontSize: 26, width: 40, textAlign: 'center', color: colors.text },
  tiers: { flexDirection: 'row', gap: 8 },
  tier: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
});
