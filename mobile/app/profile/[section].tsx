import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Chip, Field, Icon, Screen, Text, Toggle, TopBar } from '@/components';
import {
  DRIVE_OPTIONS,
  FAITH_OPTIONS,
  FEEDBACK_OPTIONS,
  FIRST_GEN_OPTIONS,
  FROM_SUGGESTIONS,
  GENDER_OPTIONS,
  getMatch,
  LANGUAGE_OPTIONS,
  MATCH_SECTIONS,
  PACE_OPTIONS,
  useData,
  VALUE_OPTIONS,
  type MatchProfile,
  type MatchSection,
  type ProfileOwner,
} from '@/data';
import { useAppStore } from '@/store';
import { colors, fonts, radius, statusColors } from '@/theme';

const COPY: Record<MatchSection, { title: string; sub: string; coachSub?: string }> = {
  style: { title: 'How you show up', sub: 'So we can pair you with coaches who teach the way you learn.', coachSub: 'So players who learn the way you teach find you.' },
  values: { title: 'What you stand on', sub: 'Pick 2 or 3. We look for coaches who share them.', coachSub: 'Pick 2 or 3. We look for players who share them.' },
  from: { title: 'Where you’re from', sub: 'Up to 3 places. Cities, countries, wherever home is. Mixed heritage and moving around both count.' },
  story: { title: 'Your story', sub: 'Some people want to learn from someone who’s been where they are.' },
  faith: { title: 'Faith', sub: 'Only used if it matters to you. Pass on it if it doesn’t.' },
  gender: { title: 'Gender', sub: 'Only used for same-gender ISOs, and only if you turn that on.' },
};

const toggle = <T,>(list: T[], v: T, max = Infinity) => (list.includes(v) ? list.filter((x) => x !== v) : list.length < max ? [...list, v] : list);

/** One "Refine your ISO profile" section. Every answer is optional. */
export default function MatchSectionScreen() {
  const { section, who = 'player' } = useLocalSearchParams<{ section: MatchSection; who?: ProfileOwner }>();
  const coach = who === 'coach';
  const loaded = useData(() => getMatch(who), [who, section]).data;
  const { saveMatchSection, setMatchPrefs } = useAppStore.getState();

  const [m, setM] = useState<MatchProfile | null>(null);
  const [sameGender, setSameGender] = useState(false);
  const [place, setPlace] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loaded) return;
    setM(loaded.match);
    setSameGender(loaded.prefs.sameGender);
  }, [loaded]);

  const index = MATCH_SECTIONS.findIndex((s) => s.id === section);
  const meta = MATCH_SECTIONS[index];
  if (!m || !meta) return <Screen>{null}</Screen>;
  const copy = COPY[section];
  const set = (patch: Partial<MatchProfile>) => setM({ ...m, ...patch });

  const advance = async () => {
    const { done } = (await getMatch(who)).match;
    const next = MATCH_SECTIONS.slice(index + 1).find((s) => !done.includes(s.id));
    if (next) router.replace({ pathname: '/profile/[section]', params: { section: next.id, who } });
    else router.back();
  };

  const fields = (): Partial<MatchProfile> => {
    switch (section) {
      case 'style':
        return { feedback: m.feedback, pace: m.pace, drive: coach ? undefined : m.drive };
      case 'values':
        return { values: m.values };
      case 'from':
        return { from: m.from };
      case 'story':
        return { firstGen: m.firstGen, immigrantFamily: m.immigrantFamily, languages: m.languages };
      case 'faith':
        return { faith: m.faith };
      case 'gender':
        return { gender: m.gender };
    }
  };

  const save = async (patch: Partial<MatchProfile>) => {
    try {
      await saveMatchSection(who, section, patch);
      if (!coach && section === 'gender') await setMatchPrefs({ sameGender: !!patch.gender && sameGender });
      await advance();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const hasAnswer = (() => {
    switch (section) {
      case 'style':
        return !!(m.feedback || m.pace || m.drive);
      case 'values':
        return m.values.length > 0;
      case 'from':
        return m.from.length > 0;
      case 'story':
        return m.firstGen.length > 0 || m.immigrantFamily !== undefined || m.languages.length > 0;
      case 'faith':
        return !!m.faith;
      case 'gender':
        return !!m.gender;
    }
  })();

  const addPlace = (p: string) => {
    const v = p.trim();
    if (!v || m.from.length >= 3 || m.from.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    set({ from: [...m.from, v] });
    setPlace('');
  };

  return (
    <Screen>
      <TopBar onBack={() => router.back()} label={`${index + 1} of ${MATCH_SECTIONS.length}`} />
      <View style={styles.group}>
        <Text variant="titleLg">{copy.title}</Text>
        <Text variant="subtitle">{coach && copy.coachSub ? copy.coachSub : copy.sub}</Text>
      </View>

      {section === 'style' ? (
        <>
          <Question label={coach ? 'How do you give feedback?' : 'How do you take feedback?'}>
            {FEEDBACK_OPTIONS.map((o) => (
              <Chip key={o.id} label={coach ? { straight: 'Straight up', encourage: 'Encouraging', mix: 'Mix of both' }[o.id] : o.label} active={m.feedback === o.id} onPress={() => set({ feedback: o.id })} />
            ))}
          </Question>
          <Question label={coach ? 'How do you run an ISO?' : 'Your pace'}>
            {PACE_OPTIONS.map((o) => (
              <Chip key={o.id} label={coach ? { plan: 'With a plan', flow: 'Let it flow' }[o.id] : o.label} active={m.pace === o.id} onPress={() => set({ pace: o.id })} />
            ))}
          </Question>
          {coach ? null : (
            <Question label="Where your head’s at">
              {DRIVE_OPTIONS.map((o) => (
                <Chip key={o.id} label={`${o.label} · ${o.sub}`} active={m.drive === o.id} onPress={() => set({ drive: o.id })} />
              ))}
            </Question>
          )}
        </>
      ) : null}

      {section === 'values' ? (
        <Question label={`${m.values.length} of 3 picked`}>
          {VALUE_OPTIONS.map((v) => (
            <Chip key={v} label={v} active={m.values.includes(v)} onPress={() => set({ values: toggle(m.values, v, 3) })} />
          ))}
        </Question>
      ) : null}

      {section === 'from' ? (
        <>
          {m.from.length ? (
            <View style={styles.chips}>
              {m.from.map((p) => (
                <Pressable key={p} accessibilityRole="button" accessibilityLabel={`Remove ${p}`} onPress={() => set({ from: m.from.filter((x) => x !== p) })} style={styles.picked}>
                  <Text variant="bodyStrong" color={colors.onGold}>
                    {p}
                  </Text>
                  <Icon name="close" size={14} color={colors.onGold} />
                </Pressable>
              ))}
            </View>
          ) : null}
          {m.from.length < 3 ? (
            <>
              <View style={styles.addRow}>
                <View style={styles.flex}>
                  <Field value={place} onChangeText={setPlace} placeholder="City or country" onSubmitEditing={() => addPlace(place)} returnKeyType="done" accessibilityLabel="Add a place" />
                </View>
                <Button label="Add" variant="outline" height={50} disabled={!place.trim()} onPress={() => addPlace(place)} />
              </View>
              <Question label="Or tap one">
                {FROM_SUGGESTIONS.filter((s) => !m.from.includes(s)).map((s) => (
                  <Chip key={s} label={s} active={false} onPress={() => addPlace(s)} />
                ))}
              </Question>
            </>
          ) : (
            <Text variant="caption">That’s 3. Tap one to swap it out.</Text>
          )}
        </>
      ) : null}

      {section === 'story' ? (
        <>
          <Question label="First in your family to…">
            {FIRST_GEN_OPTIONS.map((o) => (
              <Chip key={o.id} label={o.label} active={m.firstGen.includes(o.id)} onPress={() => set({ firstGen: toggle(m.firstGen, o.id) })} />
            ))}
          </Question>
          <Toggle
            title="Immigrant family"
            subtitle="You or your parents moved here from another country"
            value={!!m.immigrantFamily}
            onChange={(v) => set({ immigrantFamily: v })}
          />
          <Question label="Languages at home">
            {LANGUAGE_OPTIONS.map((l) => (
              <Chip key={l} label={l} active={m.languages.includes(l)} onPress={() => set({ languages: toggle(m.languages, l) })} />
            ))}
          </Question>
        </>
      ) : null}

      {section === 'faith' ? (
        <Question label="Does faith shape who you are?">
          {FAITH_OPTIONS.map((f) => (
            <Chip key={f} label={f} active={m.faith === f} onPress={() => set({ faith: m.faith === f ? undefined : f })} />
          ))}
        </Question>
      ) : null}

      {section === 'gender' ? (
        <>
          <Question label="You are">
            {GENDER_OPTIONS.map((g) => (
              <Chip key={g.id} label={g.label} active={m.gender === g.id} onPress={() => set({ gender: m.gender === g.id ? undefined : g.id })} />
            ))}
          </Question>
          {!coach && m.gender ? (
            <Toggle
              title="Prefer same-gender ISOs"
              subtitle="Moves matching ISOs and coaches up in Recommended. You can still say “I got next” on any ISO."
              value={sameGender}
              onChange={setSameGender}
            />
          ) : null}
          {coach ? <Text variant="caption">You can mark an ISO as a women’s or men’s ISO when you drop a pin.</Text> : null}
        </>
      ) : null}

      {error ? (
        <Text variant="caption" color={statusColors.bad}>
          {error}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Button label="Save" height={52} disabled={!hasAnswer} onPress={() => save(fields())} />
        <Pressable accessibilityRole="button" onPress={() => (meta.identity ? save({}) : advance())} style={styles.skip}>
          <Text style={styles.skipText} color={colors.textSecondary} align="center">
            {meta.identity ? 'Prefer not to say' : 'Skip for now'}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text variant="section">{label}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 10 },
  flex: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  picked: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: colors.gold },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  footer: { gap: 4, marginTop: 4 },
  skip: { minHeight: 44, justifyContent: 'center' },
  skipText: { fontFamily: fonts.semibold, fontSize: 15 },
});
