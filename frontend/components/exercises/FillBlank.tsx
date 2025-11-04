import React, { useState } from 'react';
import { Text, View, YStack } from 'tamagui';

import type { FillBlankExercise } from '../../src/types/exercise';
import { Button, Card, Input } from '../ui';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface FillBlankProps {
  exercise: FillBlankExercise;
  onComplete: (answer: string) => void;
}

export function FillBlank({ exercise, onComplete }: FillBlankProps) {
  const [answer, setAnswer] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = () => {
    if (answer.trim()) {
      onComplete(answer.trim());
    }
  };

  const sentenceParts = exercise.sentence.split('___');
  const beforeBlank = sentenceParts[0];
  const afterBlank = sentenceParts[1] || '';

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      <Card tone="subtle" elevated padding="$4">
        <YStack gap="$3">
          <Text fontSize="$5" color="$foreground" lineHeight="$2">
            {beforeBlank}
            <View
              backgroundColor="$blue3"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              display="inline-flex"
            >
              <Text fontSize="$5" fontWeight="700" color="$primary">
                {answer || '___'}
              </Text>
            </View>
            {afterBlank}
          </Text>
          <AudioPlayer
            gujaratiText={exercise.sentence.replace('___', exercise.correctAnswer)}
            audioUrl={exercise.audioUrl}
          />
        </YStack>
      </Card>

      {exercise.options && exercise.options.length > 0 && (
        <YStack gap="$2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setShowOptions(!showOptions)}
          >
            <Text fontSize="$4" color="$mutedForeground">
              {showOptions ? 'Hide' : 'Show'} Options
            </Text>
          </Button>

          {showOptions && (
            <View flexDirection="row" flexWrap="wrap" gap="$2">
              {exercise.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onPress={() => setAnswer(option)}
                >
                  <Text fontSize="$4">{option}</Text>
                </Button>
              ))}
            </View>
          )}
        </YStack>
      )}

      <YStack gap="$2">
        <Input
          placeholder="Type your answer"
          value={answer}
          onChangeText={setAnswer}
          size="$4"
        />
        <Button size="lg" onPress={handleSubmit} disabled={!answer.trim()}>
          Submit
        </Button>
      </YStack>
    </YStack>
  );
}

