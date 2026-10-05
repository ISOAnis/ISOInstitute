import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { Avatar, Button, Card, Screen, Text, TopBar } from '@/components';
import { getIso, getTable, useData } from '@/data';
import { dayLabel, startTime } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, fonts, pathwayColors, radius, statusColors, tracking } from '@/theme';

type Result = { kind: 'ok'; name: string } | { kind: 'bad' } | { kind: 'already'; name?: string } | null;

/** Coach enters each player's 4-digit code. Valid → checked in, hold released, rank +1. */
export default function CheckIn() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const revision = useAppStore((s) => s.revision);
  const checkIn = useAppStore((s) => s.checkIn);
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Result>(null);
  const [started, setStarted] = useState(false);

  const iso = useData(() => getIso(id), [id, revision]).data;
  const table = useData(() => getTable(id), [id, revision]).data ?? [];

  if (!iso) return <Screen>{null}</Screen>;

  const inCount = table.filter((s) => s.status === 'checked_in').length;
  const p = pathwayColors[iso.pathway];
  const sampleCodes = table.filter((s) => s.status === 'confirmed' && s.checkinCode).map((s) => s.checkinCode);

  const submit = async () => {
    if (code.length !== 4) return;
    const r = await checkIn(id, code);
    if (r.ok) setResult({ kind: 'ok', name: r.seat.playerId === 'me' ? 'You' : r.seat.playerName });
    else setResult(r.reason === 'already_in' ? { kind: 'already' } : { kind: 'bad' });
    setCode('');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <TopBar label="COACH MODE" />
        <View>
          <Text variant="eyebrow" color={p.text}>
            {dayLabel(iso.startsAt).toUpperCase()} · {startTime(iso.startsAt)}
          </Text>
          <Text variant="titleLg">Check in your table</Text>
          <Text variant="subtitle">Ask each player for their 4-digit code. No code means no RSVP.</Text>
        </View>

        <Card>
          <Text variant="eyebrow">ENTER CODE</Text>
          <TextInput
            value={code}
            onChangeText={(t) => {
              setCode(t.replace(/\D/g, '').slice(0, 4));
              setResult(null);
            }}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="0000"
            placeholderTextColor={colors.textDisabled}
            selectionColor={colors.gold}
            style={styles.codeInput}
            accessibilityLabel="Player check-in code"
            onSubmitEditing={submit}
          />
          <Button label="Check in" height={52} disabled={code.length !== 4} onPress={submit} />
          {result?.kind === 'ok' ? (
            <View style={[styles.notice, { backgroundColor: statusColors.goodTint, borderColor: statusColors.goodLine }]}>
              <Text variant="caption" color={statusColors.good}>
                {result.name} {result.name === 'You' ? 'are' : 'is'} checked in. Their $5 hold is released and the ISO counts toward their rank.
              </Text>
            </View>
          ) : null}
          {result?.kind === 'already' ? (
            <Text variant="caption" color={colors.textMuted}>
              That player is already checked in.
            </Text>
          ) : null}
          {result?.kind === 'bad' ? (
            <View style={[styles.notice, { backgroundColor: statusColors.badTint, borderColor: statusColors.badLine }]}>
              <Text variant="bodyStrong" color={statusColors.bad}>
                No RSVP for this code.
              </Text>
              <Text variant="caption" color={colors.textBody}>
                They’re not on your list, so you can kindly let them know to say “I got next” on your next ISO. Walk-ins throw off your ISO’s numbers.
              </Text>
            </View>
          ) : null}
          {sampleCodes.length ? (
            <Text variant="tiny">Prototype: try {sampleCodes.join(', ')}, or any other code</Text>
          ) : null}
        </Card>

        <View style={styles.tableHead}>
          <Text variant="section">YOUR TABLE</Text>
          <Text variant="caption" color={colors.textBody}>
            {inCount} of {iso.seats} in
          </Text>
        </View>
        <Card style={styles.roster}>
          {table.length === 0 ? <Text variant="caption">No confirmed players yet. Approve requests on My ISOs.</Text> : null}
          {table.map((s, i) => {
            const isIn = s.status === 'checked_in';
            return (
              <View key={s.playerId} style={[styles.player, i < table.length - 1 && styles.line]}>
                <Avatar initials={s.playerInitials} size={40} pathway={s.playerPathway} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{s.playerId === 'me' ? 'You' : s.playerName}</Text>
                  <Text variant="tiny">
                    {pathwayName(s.playerPathway)} · {s.playerRank}
                  </Text>
                </View>
                <Text style={styles.status} color={isIn ? statusColors.good : colors.textDim}>
                  {isIn ? 'CHECKED IN' : 'WAITING'}
                </Text>
              </View>
            );
          })}
        </Card>

        {started ? (
          <Text variant="bodyStrong" align="center" color={statusColors.good}>
            ISO started. Have a good one.
          </Text>
        ) : (
          <Button
            label={inCount > 0 ? `Start ISO · ${inCount} checked in` : 'Waiting for your first check-in'}
            height={52}
            disabled={inCount === 0}
            onPress={() => setStarted(true)}
          />
        )}
        {started ? <Button label="Back to My ISOs" variant="outline" onPress={() => router.back()} /> : null}
        <Text variant="caption" align="center">
          Players who never check in are marked no-show after 30 min.
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  codeInput: {
    height: 72,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderBox,
    backgroundColor: colors.surfaceBox,
    textAlign: 'center',
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 44,
    letterSpacing: tracking(0.4, 44),
  },
  notice: { padding: 12, borderRadius: radius.md, borderWidth: 1, gap: 4 },
  tableHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roster: { paddingVertical: 4, gap: 0 },
  player: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  line: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  status: { fontFamily: fonts.extrabold, fontSize: 10, letterSpacing: tracking(0.12, 10) },
});
