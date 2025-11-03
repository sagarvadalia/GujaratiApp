import React from 'react';
import { View, Text, Card, YStack, XStack, H3, Progress } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../store/progressStore';

export function StreakDisplay() {
  const { currentStreak, longestStreak } = useProgressStore();

  return (
    <Card elevate size="$4" bordered padding="$4">
      <YStack gap="$3" alignItems="center">
        <Ionicons name="flame" size={48} color="$primary" />
        <H3 color="$foreground">Current Streak</H3>
        <Text fontSize="$10" fontWeight="700" color="$primary">
          {currentStreak} days
        </Text>
        <Text fontSize="$4" color="$mutedForeground">
          Longest streak: {longestStreak} days
        </Text>
      </YStack>
    </Card>
  );
}

