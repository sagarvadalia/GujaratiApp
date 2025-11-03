import React from 'react';
import { Text, YStack, XStack } from 'tamagui';
import { Vocabulary } from '../../src/types/vocabulary';
import { AudioPlayer } from './AudioPlayer';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { Card as UICard, Badge } from '../ui';

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onPress?: () => void;
}

export function VocabularyCard({ vocabulary, onPress }: VocabularyCardProps) {
  const { displayMode } = useVocabularyStore();

  const shouldShowGujarati = displayMode === 'gujarati' || displayMode === 'both';
  const shouldShowEnglish = displayMode === 'english' || displayMode === 'both';

  return (
    <UICard
      interactive
      elevated
      onPress={onPress}
      marginBottom="$3"
    >
      <YStack gap="$3">
        <YStack gap="$3">
          {/* Gujarati Script */}
          {shouldShowGujarati && (
            <Text
              fontSize="$10"
              fontWeight="600"
              color="$foreground"
              textAlign="center"
              fontFamily="System"
            >
              {vocabulary.gujarati}
            </Text>
          )}

          {/* Transliteration */}
          {shouldShowEnglish && (
            <Text
              fontSize="$6"
              fontWeight="500"
              color="$primary"
              textAlign="center"
              opacity={0.9}
            >
              {vocabulary.transliteration}
            </Text>
          )}

          {/* English Translation */}
          <Text
            fontSize="$5"
            color="$foreground"
            textAlign="center"
            opacity={0.7}
          >
            {vocabulary.english}
          </Text>

          {/* Audio Player */}
          {vocabulary.audioUrl && (
            <AudioPlayer audioUrl={vocabulary.audioUrl} />
          )}

          {/* Category Badge */}
          <XStack justifyContent="center" alignItems="center" gap="$2">
            <Badge tone="muted" size="sm" label={vocabulary.category} />
            <Text fontSize="$3" color="$mutedForeground">
              Difficulty: {vocabulary.difficulty}/5
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </UICard>
  );
}

