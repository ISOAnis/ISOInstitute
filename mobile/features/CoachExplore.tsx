import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import {
  Avatar,
  Button,
  Card,
  ModeSwitch,
  Pill,
  Screen,
  Text,
} from "@/components";
import { getIsos, useData, type PathwayId } from "@/data";
import { dayLabel, startTime } from "@/lib/format";
import { pathwayName } from "@/lib/pathway";
import { useAppStore } from "@/store";
import {
  colors,
  fonts,
  gutter,
  pathwayColors,
  pathwayOrder,
  radius,
  statusColors,
  tracking,
} from "@/theme";

import { useModeSwitch } from "./useModeSwitch";

/** Coach in player mode: every pathway, open seats only, no priority. */
export function CoachExplore() {
  const revision = useAppStore((s) => s.revision);
  const coachId = useAppStore((s) => s.coachId);
  const seats = useAppStore((s) => s.seats);
  const gotNext = useAppStore((s) => s.gotNext);
  const modeSwitch = useModeSwitch();
  const [filter, setFilter] = useState<"all" | PathwayId>("all");
  const [error, setError] = useState("");

  const isos = (useData(() => getIsos(), [revision]).data ?? []).filter(
    (i) => i.coachId !== coachId && (filter === "all" || i.pathway === filter),
  );

  const request = async (id: string) => {
    try {
      setError("");
      await gotNext(id);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Screen>
      <ModeSwitch {...modeSwitch} />
      <View>
        <Text variant="title">Explore ISOs</Text>
        <Text variant="subtitle">Every pathway, near you</Text>
      </View>
      <Card style={{ borderColor: statusColors.goldLine }}>
        <Text variant="caption" color={colors.textBody}>
          Coach access: join any pathway’s ISOs. Players in that pathway get
          seats first, so you take what’s open.
        </Text>
      </Card>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillScroll}
        contentContainerStyle={styles.pills}
      >
        <Pill
          label="All"
          dotColor={colors.gold}
          active={filter === "all"}
          onPress={() => setFilter("all")}
        />
        {pathwayOrder.map((id) => (
          <Pill
            key={id}
            pathway={id}
            label={pathwayName(id)}
            active={filter === id}
            onPress={() => setFilter(id)}
          />
        ))}
      </ScrollView>

      {error ? (
        <Text variant="caption" color={statusColors.bad}>
          {error}
        </Text>
      ) : null}

      {isos.map((iso) => {
        const p = pathwayColors[iso.pathway];
        const mine = seats[iso.id];
        const requested =
          mine && mine.status !== "cancelled" && mine.status !== "declined";
        const full = iso.seatsOpen === 0;
        return (
          <Card key={iso.id}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${iso.title}`}
              onPress={() => router.push(`/iso/${iso.id}`)}
              style={styles.row}
            >
              <Avatar
                initials={iso.coach.initials}
                size={44}
                pathway={iso.pathway}
              />
              <View style={styles.flex}>
                <Text style={styles.tag} color={p.text}>
                  {iso.pathway.toUpperCase()}
                </Text>
                <Text variant="bodyStrong">{iso.title}</Text>
                <Text variant="tiny">
                  {dayLabel(iso.startsAt)} {startTime(iso.startsAt)} ·{" "}
                  {iso.areaName} ·{" "}
                  {full
                    ? "full"
                    : `${iso.seatsOpen} open ${iso.seatsOpen === 1 ? "seat" : "seats"}`}
                </Text>
              </View>
            </Pressable>
            {full && !requested ? (
              <Text variant="caption">
                Pathway players filled it. Follow the coach for the next one.
              </Text>
            ) : requested ? (
              <View style={styles.sent}>
                <Text variant="caption" color={statusColors.good}>
                  {mine.status === "confirmed"
                    ? "You’re in. Your code is on the ISO page."
                    : "You got next. The host will confirm."}
                </Text>
              </View>
            ) : (
              <Button
                label="I got next"
                height={44}
                onPress={() => request(iso.id)}
              />
            )}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  pillScroll: { marginHorizontal: -gutter },
  pills: { gap: 8, paddingHorizontal: gutter },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  tag: {
    fontFamily: fonts.extrabold,
    fontSize: 10,
    letterSpacing: tracking(0.16, 10),
  },
  sent: { paddingVertical: 4, borderRadius: radius.sm },
});
