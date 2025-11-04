import React from 'react';
import { ScrollView, Text, View, YStack } from 'tamagui';

import type { Achievement, UserAchievement } from '../../src/types/achievements';
import { Card } from '../ui';
import { AchievementCard } from './AchievementCard';

interface AchievementListProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  showProgress?: boolean;
}

export function AchievementList({
  achievements,
  userAchievements,
  showProgress = true,
}: AchievementListProps) {
  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;

  // Group achievements by type
  const groupedAchievements = achievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.type]) {
        acc[achievement.type] = [];
      }
      acc[achievement.type].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );

  const getUserAchievement = (achievementId: string): UserAchievement | undefined => {
    return userAchievements.find((ua) => ua.achievementId === achievementId);
  };

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        {/* Summary Card */}
        <Card tone="primary" elevated padding="$4">
          <YStack gap="$2" alignItems="center">
            <Text fontSize="$8" fontWeight="700" color="$primaryForeground">
              🏆 Achievements
            </Text>
            <Text fontSize="$5" color="$primaryForeground">
              {unlockedCount} / {totalCount} Unlocked
            </Text>
            <View
              width="100%"
              height={8}
              backgroundColor="$gray4"
              borderRadius="$2"
              overflow="hidden"
              marginTop="$2"
            >
              <View
                height="100%"
                width={`${(unlockedCount / totalCount) * 100}%`}
                backgroundColor="$primary"
                borderRadius="$2"
              />
            </View>
          </YStack>
        </Card>

        {/* Grouped Achievements */}
        {Object.entries(groupedAchievements).map(([type, typeAchievements]) => (
          <YStack key={type} gap="$2">
            <Text fontSize="$6" fontWeight="600" color="$color" textTransform="capitalize">
              {type.replace('-', ' ')}
            </Text>
            <YStack gap="$2">
              {typeAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  userAchievement={getUserAchievement(achievement.id)}
                  showProgress={showProgress}
                />
              ))}
            </YStack>
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  );
}

