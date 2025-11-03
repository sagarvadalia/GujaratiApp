import React, { useEffect } from 'react';
import { View, ScrollView, Text, Button, YStack } from 'tamagui';
import { StreakDisplay } from '../../components/progress/StreakDisplay';
import { ProgressStats } from '../../components/progress/ProgressStats';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function ProgressScreen() {
  const router = useRouter();
  const { isGuest } = useAuthStore();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Redirect guest users to sign-in or home
    if (isGuest && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isGuest, isSignedIn, router]);

  // Show message for guest users
  if (isGuest && !isSignedIn) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4" bg="$background">
        <YStack gap="$4" alignItems="center" maxWidth={400}>
          <Text fontSize="$8" fontWeight="700" color="$color" textAlign="center">
            Sign In Required
          </Text>
          <Text fontSize="$5" color="$color" opacity={0.8} textAlign="center">
            Progress tracking is only available for signed-in users. Please sign in to track your learning progress.
          </Text>
          <Button size="$5" onPress={() => router.push('/sign-in')} marginTop="$2">
            Sign In
          </Button>
          <Button
            variant="outlined"
            size="$5"
            onPress={() => router.replace('/')}
          >
            Go Home
          </Button>
        </YStack>
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

