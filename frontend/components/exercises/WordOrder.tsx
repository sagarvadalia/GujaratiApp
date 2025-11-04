import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';

import type { WordOrderExercise } from '../../src/types/exercise';
import { Button, Card } from '../ui';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface WordOrderProps {
  exercise: WordOrderExercise;
  onComplete: (order: number[]) => void;
}

export function WordOrder({ exercise, onComplete }: WordOrderProps) {
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [availableIndices, setAvailableIndices] = useState<number[]>(
    exercise.words.map((_, i) => i)
  );

  const handleWordSelect = (index: number) => {
    if (selectedOrder.includes(index)) {
      // Remove from selected order
      setSelectedOrder(selectedOrder.filter((i) => i !== index));
      setAvailableIndices([...availableIndices, index].sort((a, b) => a - b));
    } else {
      // Add to selected order
      setSelectedOrder([...selectedOrder, index]);
      setAvailableIndices(availableIndices.filter((i) => i !== index));
    }
  };

  const handleRemove = (index: number) => {
    const orderIndex = selectedOrder.indexOf(index);
    if (orderIndex !== -1) {
      const newOrder = selectedOrder.filter((i) => i !== index);
      setSelectedOrder(newOrder);
      setAvailableIndices([...availableIndices, index].sort((a, b) => a - b));
    }
  };

  const handleReset = () => {
    setSelectedOrder([]);
    setAvailableIndices(exercise.words.map((_, i) => i));
  };

  const handleSubmit = () => {
    if (selectedOrder.length === exercise.words.length) {
      onComplete(selectedOrder);
    }
  };

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      {exercise.translation && (
        <Card tone="subtle" elevated padding="$3">
          <YStack gap="$2">
            <Text fontSize="$4" color="$mutedForeground">
              Translation: {exercise.translation}
            </Text>
            {selectedOrder.length === exercise.words.length && (
              <AudioPlayer
                gujaratiText={selectedOrder.map((i) => exercise.words[i]).join(' ')}
              />
            )}
          </YStack>
        </Card>
      )}

      {/* Selected words in order */}
      <Card tone="primary" elevated padding="$4" minHeight={80}>
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$primaryForeground">
            Your sentence:
          </Text>
          {selectedOrder.length === 0 ? (
            <Text fontSize="$4" color="$mutedForeground" fontStyle="italic">
              Tap words below to build your sentence
            </Text>
          ) : (
            <XStack gap="$2" flexWrap="wrap">
              {selectedOrder.map((index, _i) => (
                <Card
                  key={`selected-${index}`}
                  tone="default"
                  elevated
                  padding="$2"
                  flexDirection="row"
                  alignItems="center"
                  gap="$2"
                >
                  <Text fontSize="$5" fontWeight="600" color="$foreground">
                    {exercise.words[index]}
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => handleRemove(index)}
                  >
                    <Ionicons name="close" size={16} color="$mutedForeground" />
                  </Button>
                </Card>
              ))}
            </XStack>
          )}
        </YStack>
      </Card>

      {/* Available words */}
      <YStack gap="$2">
        <Text fontSize="$4" fontWeight="600" color="$foreground">
          Available words:
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          {availableIndices.map((index) => (
            <Button
              key={`available-${index}`}
              variant="outline"
              size="md"
              onPress={() => handleWordSelect(index)}
            >
              <Text fontSize="$4">{exercise.words[index]}</Text>
            </Button>
          ))}
        </XStack>
      </YStack>

      <XStack gap="$2">
        <Button variant="ghost" size="md" onPress={handleReset}>
          <Text fontSize="$4" color="$mutedForeground">
            Reset
          </Text>
        </Button>
        <Button
          size="lg"
          onPress={handleSubmit}
          disabled={selectedOrder.length !== exercise.words.length}
          flex={1}
        >
          Submit
        </Button>
      </XStack>
    </YStack>
  );
}

