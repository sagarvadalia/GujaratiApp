import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import type { Story, StorySentence } from '../../src/types/story';
import { Button, Card } from '../ui';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface StoryReaderProps {
  story: Story;
  onComplete: () => void;
  onStartQuestions: () => void;
}

export function StoryReader({ story, onComplete, onStartQuestions }: StoryReaderProps) {
  const [selectedSentence, setSelectedSentence] = useState<StorySentence | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleSentenceTap = (sentence: StorySentence) => {
    if (selectedSentence?.id === sentence.id) {
      setSelectedSentence(null);
      setShowTranslation(false);
    } else {
      setSelectedSentence(sentence);
      setShowTranslation(true);
    }
  };

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        {/* Story Header */}
        <Card tone="primary" elevated padding="$4">
          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="book" size={32} color="$primaryForeground" />
              <Text fontSize="$7" fontWeight="700" color="$primaryForeground">
                {story.title}
              </Text>
            </XStack>
            <Text fontSize="$4" color="$mutedForeground">
              {story.description}
            </Text>
            <XStack gap="$2" alignItems="center">
              <View
                backgroundColor="$blue5"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$blue11" fontWeight="600">
                  Difficulty: {'⭐'.repeat(story.difficulty)}
                </Text>
              </View>
              <View
                backgroundColor="$green5"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$green11" fontWeight="600">
                  {story.xpReward} XP
                </Text>
              </View>
            </XStack>
          </YStack>
        </Card>

        {/* Story Instructions */}
        <Card tone="accent" padding="$3">
          <XStack gap="$2" alignItems="center">
            <Ionicons name="information-circle" size={20} color="$accentForeground" />
            <Text fontSize="$4" color="$accentForeground">
              Tap on any sentence to see its translation
            </Text>
          </XStack>
        </Card>

        {/* Story Content */}
        {story.content.map((paragraph) => (
          <Card key={paragraph.id} elevated padding="$4">
            <YStack gap="$3">
              {paragraph.sentences.map((sentence) => {
                const isSelected = selectedSentence?.id === sentence.id;

                return (
                  <View key={sentence.id}>
                    <Card
                      tone={isSelected ? 'primary' : 'subtle'}
                      padding="$3"
                      interactive
                      onPress={() => handleSentenceTap(sentence)}
                      borderWidth={isSelected ? 2 : 1}
                      borderColor={isSelected ? '$primary' : '$border'}
                    >
                      <YStack gap="$2">
                        <Text
                          fontSize="$6"
                          fontWeight={isSelected ? '700' : '500'}
                          color={isSelected ? '$primaryForeground' : '$color'}
                        >
                          {sentence.gujarati}
                        </Text>
                        <XStack alignItems="center" gap="$2">
                          <AudioPlayer gujaratiText={sentence.gujarati} audioUrl={sentence.audioUrl} />
                          <Text fontSize="$3" color="$mutedForeground">
                            Tap to translate
                          </Text>
                        </XStack>
                      </YStack>
                    </Card>

                    {isSelected && showTranslation && (
                      <Card tone="default" padding="$3" marginTop="$2" borderWidth={1} borderColor="$border">
                        <YStack gap="$2">
                          <Text fontSize="$4" color="$blue10" fontStyle="italic">
                            {sentence.transliteration}
                          </Text>
                          <Text fontSize="$4" color="$mutedForeground">
                            {sentence.english}
                          </Text>
                        </YStack>
                      </Card>
                    )}
                  </View>
                );
              })}
            </YStack>
          </Card>
        ))}

        {/* Story Complete Actions */}
        <Card tone="success" elevated padding="$4">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="checkmark-circle" size={32} color="$green11" />
              <Text fontSize="$6" fontWeight="700" color="$green11">
                Story Complete!
              </Text>
            </XStack>
            <Text fontSize="$4" color="$mutedForeground">
              You&apos;ve read the story. Now test your comprehension!
            </Text>
            <XStack gap="$2">
              <Button variant="outline" size="md" onPress={onComplete} flex={1}>
                Read Again
              </Button>
              <Button size="md" onPress={onStartQuestions} flex={1}>
                Answer Questions
              </Button>
            </XStack>
          </YStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}

