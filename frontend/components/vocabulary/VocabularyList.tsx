import React, { useState } from 'react';
import { View, Text, ScrollView, Button, XStack, YStack } from 'tamagui';
import { VocabularyCard } from './VocabularyCard';
import { Vocabulary } from '../../src/types/vocabulary';
import { trpc } from '../../utils/trpc';
import { useVocabularyStore, DisplayMode } from '../../store/vocabularyStore';

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
  const displayModes: DisplayMode[] = ['gujarati', 'english', 'both'];

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
          <Text fontSize="$4" fontWeight="600" color="$color" marginBottom="$2">
            Display Mode
          </Text>
          <XStack gap="$2" justifyContent="center">
            {displayModes.map((mode) => {
              const isSelected = displayMode === mode;
              return (
                <Button
                  key={mode}
                  size="$3"
                  backgroundColor={isSelected ? '$blue10' : '$gray3'}
                  borderColor={isSelected ? '$blue10' : '$borderColor'}
                  borderWidth={1}
                  borderRadius="$4"
                  paddingHorizontal="$4"
                  onPress={() => setDisplayMode(mode)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Text
                    color={isSelected ? '#fff' : '$color'}
                    fontWeight={isSelected ? '600' : '400'}
                    textTransform="capitalize"
                  >
                    {mode}
                  </Text>
                </Button>
              );
            })}
          </XStack>
        </YStack>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        paddingVertical="$3"
        paddingHorizontal="$4"
        bg="$background"
      >
        <XStack gap="$2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'all' && !selectedCategory);
            return (
              <Button
                key={cat}
                size="$3"
                variant={isSelected ? 'outlined' : 'outlined'}
                backgroundColor={isSelected ? '$blue10' : '$gray3'}
                borderColor={isSelected ? '$blue10' : '$borderColor'}
                borderWidth={1}
                borderRadius="$4"
                paddingHorizontal="$4"
                onPress={() => setSelectedCategory(cat === 'all' ? undefined : cat)}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text
                  textTransform="capitalize"
                  color={isSelected ? '#fff' : '$color'}
                  fontWeight={isSelected ? '600' : '400'}
                >
                  {cat}
                </Text>
              </Button>
            );
          })}
        </XStack>
      </ScrollView>

      {/* Vocabulary List */}
      <ScrollView flex={1} padding="$4">
        {vocabulary && vocabulary.length > 0 ? (
          vocabulary.map((item: Vocabulary) => (
            <VocabularyCard key={item.id} vocabulary={item} />
          ))
        ) : (
          <View flex={1} justifyContent="center" alignItems="center" paddingTop="$10">
            <Text fontSize="$6" color="$gray10">
              No vocabulary found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
