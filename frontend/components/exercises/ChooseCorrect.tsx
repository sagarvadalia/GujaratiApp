import React, { useState } from 'react';
import { Text, YStack } from 'tamagui';

import type { MultipleChoiceExercise } from '../../src/types/exercise';
import { Button, Card } from '../ui';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface ChooseCorrectProps {
  exercise: MultipleChoiceExercise;
  onComplete: (answer: string) => void;
}

export function ChooseCorrect({ exercise, onComplete }: ChooseCorrectProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onComplete(answer);
  };

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      <Card tone="subtle" elevated padding="$4">
        <YStack gap="$3" alignItems="center">
          <Text fontSize="$7" fontWeight="700" color="$foreground" textAlign="center">
            {exercise.question}
          </Text>
          <AudioPlayer
            gujaratiText={exercise.question}
            audioUrl={exercise.audioUrl}
          />
        </YStack>
      </Card>

      <YStack gap="$2">
        {exercise.options.map((option, index) => (
          <Button
            key={index}
            size="lg"
            variant={selectedAnswer === option ? 'secondary' : 'outline'}
            onPress={() => handleAnswerSelect(option)}
            disabled={!!selectedAnswer}
          >
            <Text fontSize="$5" fontWeight="600">
              {option}
            </Text>
          </Button>
        ))}
      </YStack>
    </YStack>
  );
}

