import React, { useState } from 'react';
import { View, ScrollView, Text, Button, YStack, XStack, Card, H3, Progress, Sheet } from 'tamagui';
import { StreakDisplay } from '../../components/progress/StreakDisplay';
import { ProgressStats } from '../../components/progress/ProgressStats';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressScreen() {
  const router = useRouter();
  const { isGuest } = useAuthStore();
  const { isSignedIn } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Show skeleton UI with modal for guest users
  if (isGuest && !isSignedIn) {
    return (
      <View flex={1} bg="$background" position="relative">
        {/* Skeleton UI - Greyed out version of progress page */}
        <ScrollView flex={1} padding="$4" opacity={0.4}>
          <View gap="$4" paddingTop="$2">
            {/* Skeleton Streak Display */}
            <Card elevate size="$4" bordered padding="$4" backgroundColor="$muted">
              <YStack gap="$3" alignItems="center">
                <Ionicons name="flame" size={48} color="$mutedForeground" />
                <H3 color="$mutedForeground">Current Streak</H3>
                <Text fontSize="$10" fontWeight="700" color="$mutedForeground">
                  0 days
                </Text>
                <Text fontSize="$4" color="$mutedForeground">
                  Longest streak: 0 days
                </Text>
              </YStack>
            </Card>

            {/* Skeleton Progress Stats */}
            <Card elevate size="$4" bordered padding="$4" backgroundColor="$muted">
              <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <H3 color="$mutedForeground">Daily Progress</H3>
                  <Text fontSize="$5" fontWeight="600" color="$mutedForeground">
                    0 / 10
                  </Text>
                </XStack>
                <Progress value={0} max={100} backgroundColor="$muted">
                  <Progress.Indicator backgroundColor="$mutedForeground" />
                </Progress>
              </YStack>
            </Card>

            {/* Skeleton Stats Grid */}
            <XStack gap="$3" flexWrap="wrap">
              <Card elevate size="$3" bordered padding="$3" flex={1} minWidth="45%" backgroundColor="$muted">
                <YStack gap="$2" alignItems="center">
                  <Ionicons name="book" size={32} color="$mutedForeground" />
                  <Text fontSize="$8" fontWeight="700" color="$mutedForeground">
                    0
                  </Text>
                  <Text fontSize="$3" color="$mutedForeground" textAlign="center">
                    Words Learned
                  </Text>
                </YStack>
              </Card>

              <Card elevate size="$3" bordered padding="$3" flex={1} minWidth="45%" backgroundColor="$muted">
                <YStack gap="$2" alignItems="center">
                  <Ionicons name="stats-chart" size={32} color="$mutedForeground" />
                  <Text fontSize="$8" fontWeight="700" color="$mutedForeground">
                    0%
                  </Text>
                  <Text fontSize="$3" color="$mutedForeground" textAlign="center">
                    Accuracy Rate
                  </Text>
                </YStack>
              </Card>
            </XStack>
          </View>
        </ScrollView>

        {/* Modal Overlay */}
        <Sheet
          modal
          open={showSignInModal}
          onOpenChange={setShowSignInModal}
          snapPoints={[70]}
          dismissOnSnapToBottom
          zIndex={100_000}
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            backgroundColor="rgba(0,0,0,0.7)"
          />
          <Sheet.Handle />
          <Sheet.Frame bg="$background" padding="$4">
            <YStack gap="$4" alignItems="center" justifyContent="center" paddingTop="$4">
              <Ionicons name="lock-closed" size={64} color="$primary" />
              <Text fontSize="$8" fontWeight="700" color="$foreground" textAlign="center">
                Sign In Required
              </Text>
              <Text fontSize="$5" color="$mutedForeground" textAlign="center" lineHeight="$1">
                Progress tracking is only available for signed-in users. Sign in to track your learning progress, build streaks, and see your statistics.
              </Text>
              <YStack gap="$3" width="100%" paddingTop="$2">
                <Button
                  size="$5"
                  backgroundColor="$primary"
                  borderRadius="$4"
                  paddingVertical="$3"
                  onPress={() => router.push('/sign-in')}
                >
                  <Text fontSize="$5" fontWeight="600" color="$primaryForeground">
                    Sign In
                  </Text>
                </Button>
                <Button
                  size="$5"
                  variant="outlined"
                  borderRadius="$4"
                  paddingVertical="$3"
                  onPress={() => router.push('/sign-up')}
                  borderColor="$primary"
                >
                  <Text fontSize="$5" fontWeight="600" color="$primary">
                    Create Account
                  </Text>
                </Button>
                <Button
                  size="$4"
                  variant="outlined"
                  borderRadius="$4"
                  paddingVertical="$2"
                  onPress={() => setShowSignInModal(false)}
                  borderColor="$border"
                  chromeless
                >
                  <Text fontSize="$4" color="$mutedForeground">
                    Continue as Guest
                  </Text>
                </Button>
              </YStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>

        {/* Overlay button to show modal */}
        {!showSignInModal && (
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(0,0,0,0.3)"
            justifyContent="center"
            alignItems="center"
          >
                <Button
                  size="$5"
                  backgroundColor="$primary"
                  borderRadius="$4"
                  paddingVertical="$4"
                  paddingHorizontal="$6"
                  onPress={() => setShowSignInModal(true)}
                >
                  <Text fontSize="$6" fontWeight="700" color="$primaryForeground">
                    Sign In to View Progress
                  </Text>
                </Button>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView flex={1} bg="$background" padding="$4">
      <View gap="$4" paddingTop="$2">
        <StreakDisplay />
        <ProgressStats />
      </View>
    </ScrollView>
  );
}

