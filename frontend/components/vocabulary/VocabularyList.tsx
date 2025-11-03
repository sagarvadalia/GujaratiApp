import React, { useState } from 'react';
import { View, Text, ScrollView, XStack, YStack } from 'tamagui';
import { VocabularyCard } from './VocabularyCard';
import { Vocabulary } from '../../src/types/vocabulary';
import { trpc } from '../../utils/trpc';
import { useVocabularyStore, DisplayMode } from '../../store/vocabularyStore';
import { ToggleGroup, ToggleButton } from '../ui';

interface VocabularyListProps {
  category?: string;
}

export function VocabularyList({ category }: VocabularyListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const { displayMode, setDisplayMode } = useVocabularyStore();

  const { data: vocabulary, isLoading } = selectedCategory
    ? trpc.vocabulary.getByCategory.useQuery({ category: selectedCategory as any })
    : trpc.vocabulary.getAll.useQuery();

  const categories = ['all', 'greetings', 'numbers', 'common'] as const;
  const displayModes: { mode: DisplayMode; label: string; icon?: string }[] = [
    { mode: 'gujarati', label: 'Gujarati', icon: 'language' },
    { mode: 'english', label: 'English', icon: 'text' },
    { mode: 'both', label: 'Both', icon: 'layers' },
  ];

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Loading vocabulary...</Text>
      </View>
    );
  }

  return (
    <View flex={1} bg="$background">
      {/* Display Mode Toggle */}
      <View padding="$4" paddingBottom="$2">
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$foreground" marginBottom="$2">
            Display Mode
          </Text>
          <ToggleGroup
            stretch
            value={displayMode}
            onChange={(value) => setDisplayMode(value)}
            options={displayModes.map((option) => ({
              value: option.mode,
              label: option.label,
              icon: option.icon,
            }))}
          />
        </YStack>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        paddingVertical="$3"
        paddingHorizontal="$4"
        bg="$background"
        marginBottom="$2"
      >
        <XStack gap="$2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'all' && !selectedCategory);
            return (
              <ToggleButton
                key={cat}
                size="sm"
                isActive={isSelected}
                variant={isSelected ? 'secondary' : 'ghost'}
                onPress={() => setSelectedCategory(cat === 'all' ? undefined : cat)}
              >
                <Text
                  textTransform="capitalize"
                  fontWeight={isSelected ? '600' : '500'}
                  color={isSelected ? '$secondaryForeground' : '$color'}
                >
                  {cat}
                </Text>
              </ToggleButton>
            );
          })}
        </XStack>
      </ScrollView>

      {/* Vocabulary List */}
      <ScrollView flex={1} padding="$4" paddingTop="$2">
        {vocabulary && vocabulary.length > 0 ? (
          vocabulary.map((item: Vocabulary) => (
            <VocabularyCard key={item.id} vocabulary={item} />
          ))
        ) : (
          <View flex={1} justifyContent="center" alignItems="center" paddingTop="$10">
            <Text fontSize="$6" color="$mutedForeground">
              No vocabulary found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
