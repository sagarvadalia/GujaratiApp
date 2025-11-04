import { useAuth } from '@clerk/clerk-expo';
import React, { useEffect } from 'react';
import { ScrollView, Text, View, YStack } from 'tamagui';

import { ChallengeCard } from '../../components/challenges/ChallengeCard';
import { Card } from '../../components/ui';
import { trpc } from '../../utils/trpc';

export default function ChallengesScreen() {
  const { userId } = useAuth();

  const { data: todayChallenge } = trpc.challenge.getToday.useQuery();
  const { data: userChallenges } = trpc.challenge.getUserChallenges.useQuery(
    { userId: userId ?? '' },
    { enabled: !!userId }
  );

  // Auto-update challenge progress based on user activity
  useEffect(() => {
    if (!userId || !todayChallenge) return;

    // This would be called when user completes activities
    // For now, we'll update based on progress store changes
    const interval = setInterval(() => {
      // Check and update challenge progress
      // This is a simplified version - in production, you'd track specific activities
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userId, todayChallenge]);

  if (!todayChallenge) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$mutedForeground">Loading challenges...</Text>
      </View>
    );
  }

  const todayProgress =
    userChallenges?.find((uc) => uc.challenge.id === todayChallenge.id)?.progress ?? {
      userId: userId ?? '',
      challengeId: todayChallenge.id,
      progress: 0,
      completed: false,
      bonusEarned: false,
    };

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        {/* Header */}
        <Card tone="primary" elevated padding="$4">
          <YStack gap="$2" alignItems="center">
            <Text fontSize="$8" fontWeight="700" color="$primaryForeground">
              🎯 Daily Challenges
            </Text>
            <Text fontSize="$4" color="$mutedForeground" textAlign="center">
              Complete challenges to earn bonus XP!
            </Text>
          </YStack>
        </Card>

        {/* Today's Challenge */}
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="600" color="$color">
            Today&apos;s Challenge
          </Text>
          <ChallengeCard challenge={todayChallenge} progress={todayProgress} />
        </YStack>

        {/* Recent Challenges */}
        {userChallenges && userChallenges.length > 1 && (
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="600" color="$color">
              Recent Challenges
            </Text>
            {userChallenges
              .filter((uc) => uc.challenge.id !== todayChallenge.id)
              .map((uc) => (
                <ChallengeCard key={uc.challenge.id} challenge={uc.challenge} progress={uc.progress} />
              ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}

