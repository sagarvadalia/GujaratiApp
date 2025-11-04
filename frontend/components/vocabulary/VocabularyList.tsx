import React, { useState } from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import { categories as vocabularyCategories, type Category, type Vocabulary } from '../../src/types/vocabulary';
import { type DisplayMode, useVocabularyStore } from '../../store/vocabularyStore';
import { trpc } from '../../utils/trpc';
import { ToggleButton, ToggleGroup, type ToggleOption } from '../ui';
import { VocabularyCard } from './VocabularyCard';

interface VocabularyListProps {
  category?: Category;
}

type CategoryFilterValue = Category | 'all';

const categoryFilters: readonly { value: CategoryFilterValue; label: string }[] = [
  { value: 'all', label: 'all' },
  ...vocabularyCategories.map((value) => ({ value, label: value })),
];

export function VocabularyList({ category }: VocabularyListProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(category);
  const { displayMode, setDisplayMode } = useVocabularyStore();

  const { data: vocabulary, isLoading } = selectedCategory
    ? trpc.vocabulary.getByCategory.useQuery({ category: selectedCategory })
    : trpc.vocabulary.getAll.useQuery();

  const displayModeOptions: ToggleOption<DisplayMode>[] = [
    { value: 'gujarati', label: 'Gujarati', icon: 'globe' },
    { value: 'english', label: 'English', icon: 'text' },
    { value: 'both', label: 'Both', icon: 'layers' },
  ];

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Loading vocabulary...</Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
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
            options={displayModeOptions}
          />
        </YStack>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        paddingVertical="$3"
        paddingHorizontal="$4"
        backgroundColor="$background"
        marginBottom="$2"
      >
        <XStack gap="$2">
          {categoryFilters.map(({ value, label }) => {
            const isAll = value === 'all';
            const isSelected = isAll ? !selectedCategory : selectedCategory === value;
            return (
              <ToggleButton
                key={value}
                size="sm"
                isActive={isSelected}
                variant={isSelected ? 'secondary' : 'ghost'}
                onPress={() => setSelectedCategory(isAll ? undefined : value)}
              >
                <Text
                  textTransform="capitalize"
                  fontWeight={isSelected ? '600' : '500'}
                  color={isSelected ? '$secondaryForeground' : '$color'}
                >
                  {label}
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
