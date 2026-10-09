import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Chip, Field, Icon, Text } from '@/components';
import { ALL_TAGS, MAX_CUSTOM_TAG, MAX_TAGS, TAG_CATALOG, type PathwayId, type TagGroup } from '@/data';
import { pathwayName } from '@/lib/pathway';
import { colors, fonts, pathwayColors } from '@/theme';

const PATHWAY_ORDER: PathwayId[] = ['founder', 'builder', 'healer', 'reformer', 'warrior', 'seeker'];

/**
 * Tag catalog picker, max 5. Shows the given pathway's tags and General first; other pathways
 * sit behind "More pathways". Custom tags can be added and removed like any other.
 */
export function TagPicker({ selected, onChange, pathway }: { selected: string[]; onChange: (tags: string[]) => void; pathway?: PathwayId }) {
  const [custom, setCustom] = useState('');
  const [showAll, setShowAll] = useState(false);
  const full = selected.length >= MAX_TAGS;

  const toggle = (tag: string) => {
    if (selected.includes(tag)) onChange(selected.filter((t) => t !== tag));
    else if (!full) onChange([...selected, tag]);
  };

  const addCustom = () => {
    const tag = custom.trim().replace(/\s+/g, ' ');
    if (!tag || full) return;
    const existing = [...ALL_TAGS, ...selected].find((t) => t.toLowerCase() === tag.toLowerCase());
    if (existing) {
      if (!selected.includes(existing)) onChange([...selected, existing]);
    } else {
      onChange([...selected, tag]);
    }
    setCustom('');
  };

  const customs = selected.filter((t) => !ALL_TAGS.has(t));
  const others = PATHWAY_ORDER.filter((p) => p !== pathway);
  const groups: TagGroup[] = [...(pathway ? [pathway] : []), 'general', ...(showAll ? others : [])];

  return (
    <View style={styles.wrap}>
      <Text variant="caption" color={full ? colors.gold : colors.textSecondary}>
        {full ? `${MAX_TAGS} picked. Tap one to swap it out.` : `${selected.length} of ${MAX_TAGS} picked`}
      </Text>

      {groups.map((g) => (
        <View key={g} style={styles.group}>
          <View style={styles.groupHead}>
            {g !== 'general' ? <Icon name={g} size={16} color={pathwayColors[g].text} /> : null}
            <Text variant="section">{g === 'general' ? 'General' : pathwayName(g)}</Text>
          </View>
          <View style={styles.chips}>
            {TAG_CATALOG[g].map((t) => (
              <Chip key={t} label={t} active={selected.includes(t)} onPress={() => toggle(t)} />
            ))}
          </View>
        </View>
      ))}

      <Pressable accessibilityRole="button" onPress={() => setShowAll(!showAll)} style={styles.more}>
        <Text style={styles.moreLabel}>{showAll ? 'Fewer pathways' : 'More pathways'}</Text>
        <Icon name={showAll ? 'close' : 'plus'} size={16} color={colors.text} />
      </Pressable>

      <View style={styles.group}>
        <Text variant="section">Your own</Text>
        {customs.length ? (
          <View style={styles.chips}>
            {customs.map((t) => (
              <Chip key={t} label={t} active onPress={() => toggle(t)} />
            ))}
          </View>
        ) : null}
        <View style={styles.addRow}>
          <View style={styles.flex}>
            <Field
              value={custom}
              onChangeText={setCustom}
              placeholder={full ? 'Remove one to add your own' : 'Something not on the list'}
              editable={!full}
              maxLength={MAX_CUSTOM_TAG}
              onSubmitEditing={addCustom}
              returnKeyType="done"
              accessibilityLabel="Add your own"
            />
          </View>
          <Button label="Add" variant="outline" height={50} disabled={full || !custom.trim()} onPress={addCustom} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 20 },
  flex: { flex: 1 },
  group: { gap: 10 },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, alignSelf: 'flex-start' },
  moreLabel: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
});
