import React from 'react';
import { View, Text, Card, YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Vocabulary } from '../../src/types/vocabulary';
import { AudioPlayer } from './AudioPlayer';
import { useVocabularyStore, DisplayMode } from '../../store/vocabularyStore';

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onPress?: () => void;
}

export function VocabularyCard({ vocabulary, onPress }: VocabularyCardProps) {
  const { displayMode } = useVocabularyStore();

  const shouldShowGujarati = displayMode === 'gujarati' || displayMode === 'both';
  const shouldShowEnglish = displayMode === 'english' || displayMode === 'both';

  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      hoverStyle={{ scale: 0.97 }}
      pressStyle={{ scale: 0.95 }}
      onPress={onPress}
      marginBottom="$3"
      backgroundColor="$background"
      borderColor="$borderColor"
    >
      <Card.Header padded>
        <YStack gap="$3">
          {/* Gujarati Script */}
          {shouldShowGujarati && (
            <Text
              fontSize="$10"
              fontWeight="600"
              color="$color"
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
              color="$blue10"
              textAlign="center"
              opacity={0.9}
            >
              {vocabulary.transliteration}
            </Text>
          )}

          {/* English Translation */}
          <Text
            fontSize="$5"
            color="$color"
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
            <Ionicons name="bookmark-outline" size={16} color="#666" />
            <Text fontSize="$3" color="$gray10" textTransform="capitalize">
              {vocabulary.category}
            </Text>
            <Text fontSize="$3" color="$gray10">
              • Difficulty: {vocabulary.difficulty}/5
            </Text>
          </XStack>
        </YStack>
      </Card.Header>
    </Card>
  );
}

