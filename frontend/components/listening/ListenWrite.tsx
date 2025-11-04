import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, YStack } from 'tamagui';

import type { ListenWriteExercise } from '../../src/types/exercise';
import { Button, Card } from '../ui';
import { Input } from '../ui/input';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface ListenWriteProps {
  exercise: ListenWriteExercise;
  onComplete: (answer: string) => void;
}

export function ListenWrite({ exercise, onComplete }: ListenWriteProps) {
  const [answer, setAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasPlayed] = useState(true); // Allow immediate input
  const [hintIndex, setHintIndex] = useState(-1);

  const handleSubmit = () => {
    if (answer.trim()) {
      setShowFeedback(true);
      // Wait a moment before calling onComplete to show feedback
      setTimeout(() => {
        onComplete(answer.trim());
      }, 2000);
    }
  };

  const showHint = () => {
    if (exercise.hints && hintIndex < exercise.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  const isCorrect = answer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      <Card tone="primary" elevated padding="$4" alignItems="center">
        <YStack gap="$3" alignItems="center">
          <Ionicons name="headset" size={48} color="$primaryForeground" />
          <Text fontSize="$5" color="$primaryForeground" textAlign="center">
            Listen to the audio and type what you hear in Gujarati
          </Text>
          <AudioPlayer
            audioUrl={exercise.audioUrl}
            gujaratiText={exercise.transcription}
          />
        </YStack>
      </Card>

      {hasPlayed && (
        <>
          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$foreground">
              Type what you heard:
            </Text>
            <Input
              placeholder="Type in Gujarati..."
              value={answer}
              onChangeText={setAnswer}
              size="$4"
              multiline
              minHeight={100}
            />
          </YStack>

          {exercise.hints && hintIndex < exercise.hints.length - 1 && (
            <Button variant="ghost" size="sm" onPress={showHint}>
              <Text fontSize="$4" color="$mutedForeground">
                Show Hint
              </Text>
            </Button>
          )}

          {hintIndex >= 0 && exercise.hints && (
            <Card tone="accent" padding="$3">
              <Text fontSize="$4" color="$accentForeground">
                Hint: {exercise.hints[hintIndex]}
              </Text>
            </Card>
          )}

          {!showFeedback && (
            <Button size="lg" onPress={handleSubmit} disabled={!answer.trim()}>
              Submit Answer
            </Button>
          )}

          {showFeedback && (
            <Card
              padding="$4"
              backgroundColor={isCorrect ? '$green2' : '$red2'}
              borderWidth={1}
              borderColor={isCorrect ? '$green9' : '$red9'}
            >
              <YStack gap="$2">
                <Text
                  fontSize="$5"
                  fontWeight="600"
                  color={isCorrect ? '$green11' : '$red11'}
                >
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </Text>
                <Text fontSize="$4" color={isCorrect ? '$green12' : '$red12'}>
                  Correct answer: {exercise.correctAnswer}
                </Text>
                <AudioPlayer gujaratiText={exercise.correctAnswer} />
              </YStack>
            </Card>
          )}
        </>
      )}
    </YStack>
  );
}

