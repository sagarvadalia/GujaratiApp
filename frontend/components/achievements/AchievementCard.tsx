import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';

import type { Achievement, UserAchievement } from '../../src/types/achievements';
import { Card } from '../ui';

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  showProgress?: boolean;
}

const rarityColors = {
  common: { bg: '$gray5', text: '$gray11', border: '$gray8' },
  rare: { bg: '$blue5', text: '$blue11', border: '$blue8' },
  epic: { bg: '$purple5', text: '$purple11', border: '$purple8' },
  legendary: { bg: '$yellow5', text: '$yellow11', border: '$yellow8' },
};

export function AchievementCard({
  achievement,
  userAchievement,
  showProgress = false,
}: AchievementCardProps) {
  const isUnlocked = !!userAchievement;
  const colors = rarityColors[achievement.rarity];
  const progress = userAchievement?.progress ?? 0;
  const progressPercent = Math.min(100, (progress / achievement.requirement) * 100);

  return (
    <Card
      padding="$4"
      backgroundColor={isUnlocked ? colors.bg : '$gray2'}
      borderWidth={2}
      borderColor={isUnlocked ? colors.border : '$gray6'}
      opacity={isUnlocked ? 1 : 0.6}
      elevated={isUnlocked}
    >
      <XStack gap="$3" alignItems="center">
        <View
          width={60}
          height={60}
          borderRadius="$6"
          backgroundColor={isUnlocked ? colors.bg : '$gray4'}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="$8">{achievement.icon}</Text>
        </View>

        <YStack flex={1} gap="$1">
          <XStack alignItems="center" gap="$2">
            <Text
              fontSize="$5"
              fontWeight="700"
              color={isUnlocked ? colors.text : '$mutedForeground'}
            >
              {achievement.name}
            </Text>
            {isUnlocked && (
              <View
                backgroundColor={colors.bg}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={colors.text} fontWeight="600">
                  {achievement.rarity.toUpperCase()}
                </Text>
              </View>
            )}
          </XStack>
          <Text fontSize="$4" color={isUnlocked ? '$color' : '$mutedForeground'}>
            {achievement.description}
          </Text>
          {showProgress && !isUnlocked && (
            <YStack gap="$1" marginTop="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="$mutedForeground">
                  Progress: {progress} / {achievement.requirement}
                </Text>
                <Text fontSize="$3" color="$mutedForeground" fontWeight="600">
                  {Math.round(progressPercent)}%
                </Text>
              </XStack>
              <View
                height={4}
                backgroundColor="$gray4"
                borderRadius="$2"
                overflow="hidden"
              >
                <View
                  height="100%"
                  width={`${progressPercent}%`}
                  backgroundColor={colors.bg}
                  borderRadius="$2"
                />
              </View>
            </YStack>
          )}
          {isUnlocked && userAchievement && (
            <Text fontSize="$3" color="$mutedForeground" marginTop="$1">
              Unlocked: {new Date(userAchievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
          <Text fontSize="$3" color="$green11" fontWeight="600" marginTop="$1">
            +{achievement.points} XP
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}

