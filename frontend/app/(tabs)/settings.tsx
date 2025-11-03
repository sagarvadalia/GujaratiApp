import React, { useState } from 'react';
import { View, Text, ScrollView, Button, YStack, XStack, Card, H3, Separator } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useVocabularyStore, DisplayMode } from '../../store/vocabularyStore';
import { useTheme } from '../../hooks/useTheme';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { displayMode, setDisplayMode } = useVocabularyStore();
  const { themeMode, setTheme, isDark } = useTheme();
  const { dailyGoal, setDailyGoal } = useProgressStore();
  const { isGuest } = useAuthStore();
  const { isSignedIn, user } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const displayModes: DisplayMode[] = ['gujarati', 'english', 'both'];
  const themeModes = ['light', 'dark', 'system'] as const;
  const dailyGoalOptions = [5, 10, 15, 20, 30];

  return (
    <ScrollView flex={1} bg="$background" padding="$4">
      <YStack gap="$4" paddingTop="$2">
        {/* Header */}
        <H3 color="$foreground">Settings</H3>

        {/* Account Section */}
        {isSignedIn && user && (
          <Card elevate size="$4" bordered padding="$4">
            <YStack gap="$3">
              <XStack alignItems="center" gap="$3">
                <Ionicons name="person-circle" size={32} color="$primary" />
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="600" color="$foreground">
                    {user.firstName || user.emailAddresses[0]?.emailAddress || 'User'}
                  </Text>
                  <Text fontSize="$3" color="$mutedForeground">
                    {user.emailAddresses[0]?.emailAddress}
                  </Text>
                </YStack>
              </XStack>
              <Button
                variant="outlined"
                onPress={() => router.push('/sign-in')}
                size="$3"
              >
                <Text>Manage Account</Text>
              </Button>
            </YStack>
          </Card>
        )}

        {isGuest && (
          <Card elevate size="$4" bordered padding="$4">
            <YStack gap="$3" alignItems="center">
              <Ionicons name="person-outline" size={48} color="$mutedForeground" />
              <Text fontSize="$5" fontWeight="600" color="$foreground" textAlign="center">
                Guest Mode
              </Text>
              <Text fontSize="$4" color="$mutedForeground" textAlign="center">
                Sign in to sync your progress across devices
              </Text>
              <Button
                onPress={() => router.push('/sign-in')}
                size="$4"
                width="100%"
              >
                <Text>Sign In</Text>
              </Button>
            </YStack>
          </Card>
        )}

        {/* Display Mode Section */}
        <Card elevate size="$4" bordered padding="$4">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="text" size={24} color="$primary" />
              <Text fontSize="$5" fontWeight="600" color="$foreground">
                Display Mode
              </Text>
            </XStack>
            <Text fontSize="$3" color="$mutedForeground">
              Choose how vocabulary words are displayed
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {displayModes.map((mode) => {
                const isSelected = displayMode === mode;
                return (
                  <Button
                    key={mode}
                    size="$3"
                    backgroundColor={isSelected ? '$primary' : '$muted'}
                    borderColor={isSelected ? '$primary' : '$border'}
                    borderWidth={1}
                    borderRadius="$4"
                    paddingHorizontal="$4"
                    flex={1}
                    minWidth="30%"
                    onPress={() => setDisplayMode(mode)}
                  >
                    <Text
                      color={isSelected ? '$primaryForeground' : '$foreground'}
                      fontWeight={isSelected ? '600' : '400'}
                      textTransform="capitalize"
                    >
                      {mode}
                    </Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>
        </Card>

        {/* Theme Section */}
        <Card elevate size="$4" bordered padding="$4">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color="$primary" />
              <Text fontSize="$5" fontWeight="600" color="$foreground">
                Theme
              </Text>
            </XStack>
            <Text fontSize="$3" color="$mutedForeground">
              Choose your preferred theme
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {themeModes.map((mode) => {
                const isSelected = themeMode === mode;
                return (
                  <Button
                    key={mode}
                    size="$3"
                    backgroundColor={isSelected ? '$primary' : '$muted'}
                    borderColor={isSelected ? '$primary' : '$border'}
                    borderWidth={1}
                    borderRadius="$4"
                    paddingHorizontal="$4"
                    flex={1}
                    minWidth="30%"
                    onPress={() => setTheme(mode)}
                  >
                    <Text
                      color={isSelected ? '$primaryForeground' : '$foreground'}
                      fontWeight={isSelected ? '600' : '400'}
                      textTransform="capitalize"
                    >
                      {mode}
                    </Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>
        </Card>

        {/* Daily Goal Section */}
        <Card elevate size="$4" bordered padding="$4">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="target" size={24} color="$primary" />
              <Text fontSize="$5" fontWeight="600" color="$foreground">
                Daily Goal
              </Text>
            </XStack>
            <Text fontSize="$3" color="$mutedForeground">
              Set your daily learning target
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {dailyGoalOptions.map((goal) => {
                const isSelected = dailyGoal === goal;
                return (
                  <Button
                    key={goal}
                    size="$3"
                    backgroundColor={isSelected ? '$primary' : '$muted'}
                    borderColor={isSelected ? '$primary' : '$border'}
                    borderWidth={1}
                    borderRadius="$4"
                    paddingHorizontal="$4"
                    onPress={() => setDailyGoal(goal)}
                  >
                    <Text
                      color={isSelected ? '$primaryForeground' : '$foreground'}
                      fontWeight={isSelected ? '600' : '400'}
                    >
                      {goal}
                    </Text>
                  </Button>
                );
              })}
            </XStack>
          </YStack>
        </Card>

        {/* Notifications Section */}
        <Card elevate size="$4" bordered padding="$4">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="notifications" size={24} color="$primary" />
              <Text fontSize="$5" fontWeight="600" color="$foreground">
                Notifications
              </Text>
            </XStack>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1}>
                <Text fontSize="$4" color="$foreground">
                  Daily Reminders
                </Text>
                <Text fontSize="$3" color="$mutedForeground">
                  Get reminders to practice daily
                </Text>
              </YStack>
              <Button
                size="$3"
                circular
                backgroundColor={notificationsEnabled ? '$primary' : '$muted'}
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <Ionicons
                  name={notificationsEnabled ? 'checkmark' : 'close'}
                  size={20}
                  color={notificationsEnabled ? '$primaryForeground' : '$mutedForeground'}
                />
              </Button>
            </XStack>
          </YStack>
        </Card>

        {/* App Info Section */}
        <Card elevate size="$4" bordered padding="$4">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="information-circle" size={24} color="$primary" />
              <Text fontSize="$5" fontWeight="600" color="$foreground">
                About
              </Text>
            </XStack>
            <Text fontSize="$4" color="$foreground">
              Gujarati Learning App
            </Text>
            <Text fontSize="$3" color="$mutedForeground">
              Version 1.0.0
            </Text>
            <Text fontSize="$3" color="$gray10">
              Learn Gujarati with interactive lessons and vocabulary practice
            </Text>
          </YStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}

