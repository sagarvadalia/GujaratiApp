import React, { useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';

import type { MatchPairsExercise } from '../../src/types/exercise';
import { Card } from '../ui';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface MatchPairsProps {
  exercise: MatchPairsExercise;
  onComplete: (matchedPairs: string[]) => void;
}

export function MatchPairs({ exercise, onComplete }: MatchPairsProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [leftItems] = useState(
    [...exercise.pairs].sort(() => Math.random() - 0.5)
  );
  const [rightItems] = useState(
    [...exercise.pairs].sort(() => Math.random() - 0.5)
  );

  const handleLeftSelect = (pairId: string) => {
    if (matchedPairs.has(pairId)) return;
    setSelectedLeft(pairId);
    if (selectedRight) {
      checkMatch(pairId, selectedRight);
    }
  };

  const handleRightSelect = (pairId: string) => {
    if (matchedPairs.has(pairId)) return;
    setSelectedRight(pairId);
    if (selectedLeft) {
      checkMatch(selectedLeft, pairId);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    const leftPair = exercise.pairs.find((p) => p.id === leftId);
    const rightPair = exercise.pairs.find((p) => p.id === rightId);

    if (leftPair && rightPair && leftPair.id === rightPair.id) {
      // Correct match
      setMatchedPairs(new Set([...matchedPairs, leftId]));
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all pairs matched
      if (matchedPairs.size + 1 === exercise.pairs.length) {
        onComplete([...matchedPairs, leftId]);
      }
    } else {
      // Wrong match - reset selection
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      <XStack gap="$4" flexWrap="wrap">
        {/* Left Column - Gujarati */}
        <YStack flex={1} minWidth="45%" gap="$2">
          <Text fontSize="$5" fontWeight="600" color="$foreground" marginBottom="$2">
            Gujarati
          </Text>
          {leftItems.map((pair) => {
            const isMatched = matchedPairs.has(pair.id);
            const isSelected = selectedLeft === pair.id;
            return (
              <Card
                key={pair.id}
                tone={isMatched ? 'subtle' : 'default'}
                elevated={!isMatched}
                interactive={!isMatched}
                onPress={() => handleLeftSelect(pair.id)}
                opacity={isMatched ? 0.5 : 1}
                borderWidth={isSelected ? 2 : 1}
                borderColor={isSelected ? '$primary' : '$border'}
                padding="$3"
              >
                <XStack alignItems="center" justifyContent="center" gap="$2">
                  <Text
                    fontSize="$5"
                    fontWeight={isSelected ? '700' : '500'}
                    color={isMatched ? '$mutedForeground' : '$foreground'}
                    textAlign="center"
                  >
                    {pair.left}
                  </Text>
                  <AudioPlayer gujaratiText={pair.left} />
                </XStack>
              </Card>
            );
          })}
        </YStack>

        {/* Right Column - English */}
        <YStack flex={1} minWidth="45%" gap="$2">
          <Text fontSize="$5" fontWeight="600" color="$foreground" marginBottom="$2">
            English
          </Text>
          {rightItems.map((pair) => {
            const isMatched = matchedPairs.has(pair.id);
            const isSelected = selectedRight === pair.id;
            return (
              <Card
                key={pair.id}
                tone={isMatched ? 'subtle' : 'default'}
                elevated={!isMatched}
                interactive={!isMatched}
                onPress={() => handleRightSelect(pair.id)}
                opacity={isMatched ? 0.5 : 1}
                borderWidth={isSelected ? 2 : 1}
                borderColor={isSelected ? '$primary' : '$border'}
                padding="$3"
              >
                <Text
                  fontSize="$5"
                  fontWeight={isSelected ? '700' : '500'}
                  color={isMatched ? '$mutedForeground' : '$foreground'}
                  textAlign="center"
                >
                  {pair.right}
                </Text>
              </Card>
            );
          })}
        </YStack>
      </XStack>

      <Text fontSize="$4" color="$mutedForeground" textAlign="center">
        Matched: {matchedPairs.size} / {exercise.pairs.length}
      </Text>
    </YStack>
  );
}

