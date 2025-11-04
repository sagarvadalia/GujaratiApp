import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, YStack } from "tamagui";

import type { ListenTapExercise } from "../../src/types/exercise";
import { Button, Card } from "../ui";
import { AudioPlayer } from "../vocabulary/AudioPlayer";

interface ListenTapProps {
  exercise: ListenTapExercise;
  onComplete: (answer: string) => void;
}

export function ListenTap({ exercise, onComplete }: ListenTapProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasPlayed] = useState(true); // Start as true since AudioPlayer doesn't have onPlay callback

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onComplete(answer);
  };

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      <Card tone="primary" elevated padding="$4" alignItems="center">
        <YStack gap="$3" alignItems="center">
          <Ionicons name="headset" size={48} color="$primaryForeground" />
          <Text fontSize="$5" color="$primaryForeground" textAlign="center">
            Listen to the audio and select the correct word
          </Text>
          {exercise.audioUrl && <AudioPlayer audioUrl={exercise.audioUrl} />}
        </YStack>
      </Card>

      {hasPlayed && (
        <YStack gap="$2">
          {exercise.options.map((option, index) => (
            <Button
              key={index}
              size="lg"
              variant={selectedAnswer === option ? "secondary" : "outline"}
              onPress={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
            >
              <Text fontSize="$5" fontWeight="600">
                {option}
              </Text>
            </Button>
          ))}
        </YStack>
      )}
    </YStack>
  );
}
