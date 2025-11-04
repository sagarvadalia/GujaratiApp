import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { H3, ScrollView, Text, XStack, YStack } from "tamagui";

import { Button as UIButton, Card as UICard } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import { useProgressStore } from "../../store/progressStore";
import {
  type DisplayMode,
  useVocabularyStore,
} from "../../store/vocabularyStore";

export default function SettingsScreen() {
  const { displayMode, setDisplayMode } = useVocabularyStore();
  const { themeMode, setTheme, isDark } = useTheme();
  const { dailyGoal, setDailyGoal } = useProgressStore();
  const { isGuest } = useAuthStore();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const displayModes: DisplayMode[] = ["gujarati", "english", "both"];
  const themeModes = ["light", "dark", "system"] as const;
  const dailyGoalOptions = [5, 10, 15, 20, 30];

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4" paddingTop="$2">
        {/* Header */}
        <H3 color="$foreground">Settings</H3>

        {/* Account Section */}
        {isSignedIn && user && (
          <UICard elevated tone="subtle">
            <YStack gap="$3">
              <XStack alignItems="center" gap="$3">
                <Ionicons name="person-circle" size={32} color="#6366F1" />
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="600" color="$foreground">
                    {user.firstName ??
                      user.emailAddresses?.[0]?.emailAddress ??
                      "User"}
                  </Text>
                  <Text fontSize="$3" color="$mutedForeground">
                    {user.emailAddresses?.[0]?.emailAddress}
                  </Text>
                </YStack>
              </XStack>
              <UIButton
                variant="outline"
                onPress={() => router.push("/sign-in")}
                size="sm"
              >
                <Text>Manage Account</Text>
              </UIButton>
            </YStack>
          </UICard>
        )}

        {isGuest && (
          <UICard elevated>
            <YStack gap="$3" alignItems="center">
              <Ionicons name="person-outline" size={48} color="#94A3B8" />
              <Text
                fontSize="$5"
                fontWeight="600"
                color="$foreground"
                textAlign="center"
              >
                Guest Mode
              </Text>
              <Text fontSize="$4" color="$mutedForeground" textAlign="center">
                Sign in to sync your progress across devices
              </Text>
              <UIButton onPress={() => router.push("/sign-in")} size="lg" block>
                <Text>Sign In</Text>
              </UIButton>
            </YStack>
          </UICard>
        )}

        {/* Display Mode Section */}
        <UICard elevated>
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="text" size={24} color="#6366F1" />
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
                  <UIButton
                    key={mode}
                    size="sm"
                    backgroundColor={isSelected ? "$primary" : "$muted"}
                    borderColor={isSelected ? "$primary" : "$border"}
                    borderWidth={1}
                    borderRadius="$4"
                    paddingHorizontal="$4"
                    flex={1}
                    minWidth="30%"
                    onPress={() => setDisplayMode(mode)}
                  >
                    <Text
                      color={isSelected ? "$primaryForeground" : "$foreground"}
                      fontWeight={isSelected ? "600" : "400"}
                      textTransform="capitalize"
                    >
                      {mode}
                    </Text>
                  </UIButton>
                );
              })}
            </XStack>
          </YStack>
        </UICard>

        {/* Theme Section */}
        <UICard elevated>
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={24}
                color="#6366F1"
              />
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
                  <UIButton
                    key={mode}
                    size="sm"
                    backgroundColor={isSelected ? "$primary" : "$muted"}
                    borderColor={isSelected ? "$primary" : "$border"}
                    borderWidth={1}
                    borderRadius="$4"
                    paddingHorizontal="$4"
                    flex={1}
                    minWidth="30%"
                    onPress={() => setTheme(mode)}
                  >
                    <Text
                      color={isSelected ? "$primaryForeground" : "$foreground"}
                      fontWeight={isSelected ? "600" : "400"}
                      textTransform="capitalize"
                    >
                      {mode}
                    </Text>
                  </UIButton>
                );
              })}
            </XStack>
          </YStack>
        </UICard>

        {/* Daily Goal Section */}
        <UICard elevated>
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="flag" size={24} color="#6366F1" />
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
                  <UIButton
                    key={goal}
                    size="sm"
                    backgroundColor={isSelected ? "$primary" : "$muted"}
                    borderColor={isSelected ? "$primary" : "$border"}
                    borderWidth={1}
                    borderRadius="$4"
                    paddingHorizontal="$4"
                    onPress={() => setDailyGoal(goal)}
                  >
                    <Text
                      color={isSelected ? "$primaryForeground" : "$foreground"}
                      fontWeight={isSelected ? "600" : "400"}
                    >
                      {goal}
                    </Text>
                  </UIButton>
                );
              })}
            </XStack>
          </YStack>
        </UICard>

        {/* Notifications Section */}
        <UICard elevated>
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="notifications" size={24} color="#6366F1" />
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
              <UIButton
                size="sm"
                circular
                backgroundColor={notificationsEnabled ? "$primary" : "$muted"}
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <Ionicons
                  name={notificationsEnabled ? "checkmark" : "close"}
                  size={20}
                  color={notificationsEnabled ? "#0F172A" : "#94A3B8"}
                />
              </UIButton>
            </XStack>
          </YStack>
        </UICard>

        {/* App Info Section */}
        <UICard elevated>
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Ionicons name="information-circle" size={24} color="#6366F1" />
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
        </UICard>
      </YStack>
    </ScrollView>
  );
}
