import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import type { Leaderboard, LeaderboardEntry } from '../../src/types/leaderboard';
import { Card } from '../ui';

interface LeaderboardListProps {
  leaderboard: Leaderboard;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return { bg: '$yellow5', text: '$yellow11' };
  if (rank === 2) return { bg: '$gray5', text: '$gray11' };
  if (rank === 3) return { bg: '$orange5', text: '$orange11' };
  return { bg: '$gray2', text: '$color' };
};

function LeaderboardEntryCard({
  entry,
  isCurrentUser = false,
}: {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}) {
  const colors = getRankColor(entry.rank);

  return (
    <Card
      padding="$3"
      backgroundColor={isCurrentUser ? '$blue2' : colors.bg}
      borderWidth={isCurrentUser ? 2 : 1}
      borderColor={isCurrentUser ? '$blue9' : '$border'}
    >
      <XStack gap="$3" alignItems="center">
        <View
          width={40}
          height={40}
          borderRadius="$6"
          backgroundColor={colors.bg}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="$4" fontWeight="700" color={colors.text}>
            {getRankIcon(entry.rank)}
          </Text>
        </View>

        <YStack flex={1} gap="$1">
          <XStack alignItems="center" gap="$2">
            <Text fontSize="$5" fontWeight="600" color={isCurrentUser ? '$blue11' : '$color'}>
              {entry.username}
            </Text>
            {isCurrentUser && (
              <Text fontSize="$3" color="$blue11" fontWeight="600">
                (You)
              </Text>
            )}
          </XStack>
          <XStack gap="$3">
            <Text fontSize="$3" color="$mutedForeground">
              Level {entry.level}
            </Text>
            <Text fontSize="$3" color="$mutedForeground">
              🔥 {entry.streak}
            </Text>
            <Text fontSize="$3" color="$mutedForeground">
              📚 {entry.wordsLearned}
            </Text>
          </XStack>
        </YStack>

        <YStack alignItems="flex-end" gap="$1">
          <Text fontSize="$5" fontWeight="700" color={colors.text}>
            {entry.score.toLocaleString()}
          </Text>
          <Text fontSize="$2" color="$mutedForeground">
            points
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}

export function LeaderboardList({ leaderboard }: LeaderboardListProps) {
  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        {/* Header */}
        <Card tone="primary" elevated padding="$4">
          <YStack gap="$2" alignItems="center">
            <Ionicons name="trophy" size={48} color="$primaryForeground" />
            <Text fontSize="$7" fontWeight="700" color="$primaryForeground" textTransform="capitalize">
              {leaderboard.period.replace('-', ' ')} Leaderboard
            </Text>
            {leaderboard.userRank && (
              <Text fontSize="$5" color="$primaryForeground" opacity={0.9}>
                Your Rank: #{leaderboard.userRank}
              </Text>
            )}
          </YStack>
        </Card>

        {/* User's Entry (if not in top entries) */}
        {leaderboard.userEntry &&
          !leaderboard.entries.some((e) => e.userId === leaderboard.userEntry?.userId) && (
            <Card tone="accent" padding="$3" borderWidth={2} borderColor="$accent">
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$accentForeground">
                  Your Position:
                </Text>
                <LeaderboardEntryCard entry={leaderboard.userEntry} isCurrentUser={true} />
              </YStack>
            </Card>
          )}

        {/* Top Entries */}
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="600" color="$color">
            Top Performers
          </Text>
          {leaderboard.entries.map((entry) => (
            <LeaderboardEntryCard
              key={entry.userId}
              entry={entry}
              isCurrentUser={entry.userId === leaderboard.userEntry?.userId}
            />
          ))}
        </YStack>

        {/* Last Updated */}
        <Card tone="subtle" padding="$2">
          <Text fontSize="$3" color="$mutedForeground" textAlign="center">
            Last updated: {new Date(leaderboard.updatedAt).toLocaleString()}
          </Text>
        </Card>
      </YStack>
    </ScrollView>
  );
}

