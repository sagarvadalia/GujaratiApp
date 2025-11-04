import { useAuth } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import { LeaderboardList } from '../../components/leaderboard/LeaderboardList';
import { Button, Card } from '../../components/ui';
import type { LeaderboardPeriod } from '../../src/types/leaderboard';
import { trpc } from '../../utils/trpc';

export default function LeaderboardScreen() {
  const { userId } = useAuth();
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');

  const { data: leaderboard } = trpc.leaderboard.get.useQuery({
    period,
    userId: userId ?? undefined,
    limit: 50,
  });

  const periods: { label: string; value: LeaderboardPeriod }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'All Time', value: 'all-time' },
  ];

  if (!leaderboard) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$mutedForeground">Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Period Selector */}
      <Card padding="$3" borderBottomWidth={1} borderBottomColor="$border">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$2">
            {periods.map((p) => (
              <Button
                key={p.value}
                variant={period === p.value ? 'default' : 'outline'}
                size="$3"
                onPress={() => setPeriod(p.value)}
              >
                <Text fontSize="$4" fontWeight={period === p.value ? '700' : '500'}>
                  {p.label}
                </Text>
              </Button>
            ))}
          </XStack>
        </ScrollView>
      </Card>

      {/* Leaderboard */}
      <LeaderboardList leaderboard={leaderboard} />
    </YStack>
  );
}

