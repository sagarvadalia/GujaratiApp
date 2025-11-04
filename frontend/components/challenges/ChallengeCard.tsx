import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';

import type { DailyChallenge, UserChallengeProgress } from '../../src/types/challenge';
import { Card } from '../ui';

interface ChallengeCardProps {
  challenge: DailyChallenge;
  progress: UserChallengeProgress;
}

const difficultyColors = {
  easy: { bg: '$green5', text: '$green11' },
  medium: { bg: '$yellow5', text: '$yellow11' },
  hard: { bg: '$red5', text: '$red11' },
};

const getChallengeIcon = (type: DailyChallenge['type']) => {
  switch (type) {
    case 'complete-lessons':
      return 'book';
    case 'earn-xp':
      return 'star';
    case 'learn-vocabulary':
      return 'library';
    case 'practice-exercises':
      return 'flash';
    case 'maintain-streak':
      return 'flame';
    case 'complete-story':
      return 'bookmark';
    default:
      return 'trophy';
  }
};

export function ChallengeCard({ challenge, progress }: ChallengeCardProps) {
  const difficultyColor = difficultyColors[challenge.difficulty];
  const progressPercent = Math.min(100, (progress.progress / challenge.target) * 100);
  const iconName = getChallengeIcon(challenge.type);

  return (
    <Card
      padding="$4"
      backgroundColor={progress.completed ? '$green2' : '$background'}
      borderWidth={progress.completed ? 2 : 1}
      borderColor={progress.completed ? '$green9' : '$border'}
      elevated={progress.completed}
    >
      <YStack gap="$3">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center" flex={1}>
            <View
              width={48}
              height={48}
              borderRadius="$6"
              backgroundColor={difficultyColor.bg}
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name={iconName as any} size={24} color={difficultyColor.text} />
            </View>
            <YStack flex={1}>
              <Text fontSize="$5" fontWeight="700" color="$color">
                {challenge.title}
              </Text>
              <Text fontSize="$3" color="$mutedForeground">
                {challenge.description}
              </Text>
            </YStack>
          </XStack>
          <View
            backgroundColor={difficultyColor.bg}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <Text fontSize="$2" color={difficultyColor.text} fontWeight="600" textTransform="uppercase">
              {challenge.difficulty}
            </Text>
          </View>
        </XStack>

        {/* Progress Bar */}
        <YStack gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" color="$mutedForeground">
              Progress: {progress.progress} / {challenge.target}
            </Text>
            <Text fontSize="$4" fontWeight="600" color="$color">
              {Math.round(progressPercent)}%
            </Text>
          </XStack>
          <View
            height={8}
            backgroundColor="$gray4"
            borderRadius="$2"
            overflow="hidden"
          >
            <View
              height="100%"
              width={`${progressPercent}%`}
              backgroundColor={progress.completed ? '$green9' : '$primary'}
              borderRadius="$2"
            />
          </View>
        </YStack>

        {/* Rewards */}
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$3" alignItems="center">
            <XStack gap="$1" alignItems="center">
              <Ionicons name="star" size={16} color="$yellow11" />
              <Text fontSize="$4" fontWeight="600" color="$color">
                {challenge.reward} XP
              </Text>
            </XStack>
            {challenge.bonusReward && (
              <XStack gap="$1" alignItems="center">
                <Ionicons name="flash" size={16} color="$purple11" />
                <Text fontSize="$4" fontWeight="600" color="$purple11">
                  +{challenge.bonusReward} Bonus
                </Text>
              </XStack>
            )}
          </XStack>
          {progress.completed && (
            <View
              backgroundColor="$green5"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <XStack gap="$1" alignItems="center">
                <Ionicons name="checkmark-circle" size={16} color="$green11" />
                <Text fontSize="$3" color="$green11" fontWeight="600">
                  Completed!
                </Text>
              </XStack>
            </View>
          )}
        </XStack>
      </YStack>
    </Card>
  );
}

