import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Avatar, Card, OverallBox, Pill, Screen, Text } from "@/components";
import { getCoaches, useData, type PathwayId } from "@/data";
import { pathwayName } from "@/lib/pathway";
import { useAppStore } from "@/store";
import {
  colors,
  fonts,
  gutter,
  pathwayColors,
  pathwayOrder,
  radius,
} from "@/theme";

export default function CoachesScreen() {
  const follows = useAppStore((s) => s.follows);
  const toggleFollow = useAppStore((s) => s.toggleFollow);
  const [filter, setFilter] = useState<"all" | PathwayId>("all");
  const coaches = (useData(getCoaches, []).data ?? [])
    .filter((c) => filter === "all" || c.pathway === filter)
    .sort((a, b) => b.overall - a.overall);

  return (
    <Screen>
      <View style={styles.head}>
        <Text variant="eyebrow">Denver metro</Text>
        <View>
          <Text variant="title">Coaches</Text>
          <Text variant="subtitle">
            Follow a coach and you’ll get pinged the moment they drop a pin.
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillScroll}
        contentContainerStyle={styles.pills}
      >
        <Pill
          label="All"
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

      <View style={styles.list}>
        {coaches.map((c) => {
          const following = follows.includes(c.id);
          return (
            <Card key={c.id} style={styles.row}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Coach card for ${c.name}`}
                onPress={() => router.push(`/coach/${c.id}`)}
                style={styles.open}
              >
                <Avatar
                  initials={c.initials}
                  photo={c.photo}
                  size={52}
                  pathway={c.pathway}
                />
                <View style={styles.flex}>
                  <Text variant="rowTitle">{c.name}</Text>
                  <Text variant="caption">
                    <Text
                      variant="caption"
                      color={pathwayColors[c.pathway].text}
                      style={styles.bold}
                    >
                      {pathwayName(c.pathway)}
                    </Text>{" "}
                    · {c.tier} · {c.isosHosted} ISOs hosted
                  </Text>
                  <Text variant="caption">{c.subtitle}</Text>
                </View>
              </Pressable>
              <View style={styles.right}>
                <OverallBox value={c.overall} pathway={c.pathway} size={46} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    following ? `Unfollow ${c.name}` : `Follow ${c.name}`
                  }
                  onPress={() => toggleFollow(c.id)}
                  hitSlop={8}
                  style={[styles.follow, following && styles.following]}
                >
                  <Text
                    style={styles.followText}
                    color={following ? colors.textSecondary : colors.text}
                  >
                    {following ? "Following" : "Follow"}
                  </Text>
                </Pressable>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  bold: { fontFamily: fonts.bold },
  head: { gap: 8 },
  list: { gap: 12 },
  pillScroll: { marginHorizontal: -gutter },
  pills: { gap: 8, paddingHorizontal: gutter },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  open: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  right: { alignItems: "center", gap: 8 },
  follow: {
    minHeight: 36,
    minWidth: 88,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  following: { backgroundColor: colors.transparent },
  followText: { fontFamily: fonts.bold, fontSize: 14 },
});
