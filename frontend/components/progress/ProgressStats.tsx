import React from 'react';
import { View, Text, Card, YStack, XStack, H3, Progress } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';

export function ProgressStats() {
  const {
    wordsLearned,
    dailyGoal,
    dailyProgress,
    accuracyRate,
    completedCategories,
  } = useProgressStore();

  const progressPercentage = dailyGoal > 0 ? (dailyProgress / dailyGoal) * 100 : 0;

  return (
    <YStack gap="$3">
      {/* Daily Progress */}
      <Card elevate size="$4" bordered padding="$4">
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <H3 color="$color">Daily Progress</H3>
            <Text fontSize="$5" fontWeight="600" color="$blue10">
              {dailyProgress} / {dailyGoal}
            </Text>
          </XStack>
          <Progress value={progressPercentage} max={100} backgroundColor="$gray5">
            <Progress.Indicator animation="bouncy" backgroundColor="$blue10" />
          </Progress>
          {progressPercentage >= 100 && (
            <XStack alignItems="center" gap="$2">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text fontSize="$4" color="$green10">
                Daily goal achieved!
              </Text>
            </XStack>
          )}
        </YStack>
      </Card>

      {/* Stats Grid */}
      <XStack gap="$3" flexWrap="wrap">
        <Card elevate size="$3" bordered padding="$3" flex={1} minWidth="45%">
          <YStack gap="$2" alignItems="center">
            <Ionicons name="book" size={32} color="#3b82f6" />
            <Text fontSize="$8" fontWeight="700" color="$blue10">
              {wordsLearned}
            </Text>
            <Text fontSize="$3" color="$gray10" textAlign="center">
              Words Learned
            </Text>
          </YStack>
        </Card>

        <Card elevate size="$3" bordered padding="$3" flex={1} minWidth="45%">
          <YStack gap="$2" alignItems="center">
            <Ionicons name="stats-chart" size={32} color="#22c55e" />
            <Text fontSize="$8" fontWeight="700" color="$green10">
              {accuracyRate.toFixed(1)}%
            </Text>
            <Text fontSize="$3" color="$gray10" textAlign="center">
              Accuracy Rate
            </Text>
          </YStack>
        </Card>
      </XStack>

      {/* Completed Categories */}
      {completedCategories.length > 0 && (
        <Card elevate size="$4" bordered padding="$4">
          <YStack gap="$3">
            <H3 color="$color">Completed Categories</H3>
            <XStack gap="$2" flexWrap="wrap">
              {completedCategories.map((category) => (
                <View
                  key={category}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$3"
                  backgroundColor="$blue5"
                >
                  <Text fontSize="$3" color="$blue10" textTransform="capitalize">
                    {category}
                  </Text>
                </View>
              ))}
            </XStack>
          </YStack>
        </Card>
      )}
    </YStack>
  );
}

