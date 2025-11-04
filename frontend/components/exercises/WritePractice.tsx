import React, { useState } from 'react';
import { Text, YStack } from 'tamagui';

import type { WriteExercise } from '../../src/types/exercise';
import { Button, Card, Input } from '../ui';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface WritePracticeProps {
  exercise: WriteExercise;
  onComplete: (answer: string) => void;
}

export function WritePractice({ exercise, onComplete }: WritePracticeProps) {
  const [answer, setAnswer] = useState('');
  const [hintIndex, setHintIndex] = useState(-1);

  const handleSubmit = () => {
    if (answer.trim()) {
      onComplete(answer.trim());
    }
  };

  const showHint = () => {
    if (exercise.hints && hintIndex < exercise.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      <Card tone="subtle" elevated padding="$4">
        <YStack gap="$2">
          <Text fontSize="$5" color="$foreground" lineHeight="$2">
            {exercise.prompt}
          </Text>
          {exercise.correctAnswer && (
            <AudioPlayer gujaratiText={exercise.correctAnswer} />
          )}
        </YStack>
      </Card>

      {hintIndex >= 0 && exercise.hints && (
        <Card tone="primary" elevated padding="$3">
          <Text fontSize="$4" color="$primaryForeground">
            Hint: {exercise.hints[hintIndex]}
          </Text>
        </Card>
      )}

      <YStack gap="$2">
        <Text fontSize="$4" fontWeight="600" color="$foreground">
          Type your answer in Gujarati:
        </Text>
        <Input
          placeholder="Type Gujarati text here..."
          value={answer}
          onChangeText={setAnswer}
          size="$4"
          multiline
          minHeight={100}
        />
        {exercise.hints && hintIndex < exercise.hints.length - 1 && (
          <Button variant="ghost" size="sm" onPress={showHint}>
            <Text fontSize="$4" color="$mutedForeground">
              Show Hint
            </Text>
          </Button>
        )}
        <Button size="lg" onPress={handleSubmit} disabled={!answer.trim()}>
          Submit
        </Button>
      </YStack>
    </YStack>
  );
}

