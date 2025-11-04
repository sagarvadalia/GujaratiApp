import { useAuth } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { ScrollView, Text, View, YStack } from 'tamagui';

import { Button, Card } from '../../components/ui';
import { VocabularyCard } from '../../components/vocabulary/VocabularyCard';
import { trpc } from '../../utils/trpc';

type QualityScore = 0 | 1 | 2 | 3 | 4 | 5;

export default function ReviewScreen() {
  const { userId } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data: dueItems } = trpc.srs.getDueItems.useQuery(
    { userId: userId ?? 'guest', limit: 20 },
    { enabled: !!userId }
  );

  const { data: vocabularyMap } = trpc.vocabulary.getAll.useQuery();
  const recordReviewMutation = trpc.srs.recordReview.useMutation();

  const currentItem = dueItems?.[currentIndex];
  const currentVocabulary = currentItem
    ? vocabularyMap?.find((v) => v.id === currentItem.vocabularyId)
    : null;

  const handleQualitySelect = async (quality: QualityScore) => {
    if (!currentItem || !userId) return;

    await recordReviewMutation.mutateAsync({
      userId,
      vocabularyId: currentItem.vocabularyId,
      quality,
    });

    // Move to next item
    if (currentIndex < (dueItems?.length ?? 0) - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // All items reviewed
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  };

  if (!dueItems || dueItems.length === 0) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Card padding="$4">
          <YStack gap="$3" alignItems="center">
            <Text fontSize="$7" fontWeight="700" color="$color">
              🎉 All Caught Up!
            </Text>
            <Text fontSize="$5" color="$mutedForeground" textAlign="center">
              You have no vocabulary items due for review. Great job!
            </Text>
          </YStack>
        </Card>
      </View>
    );
  }

  if (!currentVocabulary) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text color="$mutedForeground">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        {/* Progress */}
        <Card tone="subtle" padding="$3">
          <Text fontSize="$4" color="$mutedForeground">
            Review {currentIndex + 1} of {dueItems.length}
          </Text>
        </Card>

        {/* Vocabulary Card */}
        <VocabularyCard vocabulary={currentVocabulary} />

        {/* Quality Selection */}
        {showAnswer && (
          <Card padding="$4">
            <YStack gap="$3">
              <Text fontSize="$6" fontWeight="600" color="$color" textAlign="center">
                How well did you know this?
              </Text>
              <YStack gap="$2">
                <Button
                  size="lg"
                  variant="success"
                  onPress={() => handleQualitySelect(5)}
                >
                  Perfect (5)
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  onPress={() => handleQualitySelect(4)}
                >
                  Correct with hesitation (4)
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onPress={() => handleQualitySelect(3)}
                >
                  Correct with difficulty (3)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onPress={() => handleQualitySelect(2)}
                >
                  Incorrect but remembered (2)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onPress={() => handleQualitySelect(1)}
                >
                  Incorrect but familiar (1)
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onPress={() => handleQualitySelect(0)}
                >
                  Complete blackout (0)
                </Button>
              </YStack>
            </YStack>
          </Card>
        )}

        {/* Show Answer Button */}
        {!showAnswer && (
          <Button size="lg" onPress={() => setShowAnswer(true)}>
            Show Answer
          </Button>
        )}
      </YStack>
    </ScrollView>
  );
}

