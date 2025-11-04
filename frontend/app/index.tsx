import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  H3,
  Progress,
  ScrollView,
  Text,
  useTheme as useTamaguiTheme,
  XStack,
  YStack,
} from "tamagui";

import { Onboarding } from "../components/auth/Onboarding";
import { XPBar } from "../components/progress/XPBar";
import { Badge, Button as UIButton, Card as UICard } from "../components/ui";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";

export default function Index() {
  const router = useRouter();
  const { hasCompletedOnboarding } = useAuthStore();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const {
    currentStreak,
    dailyGoal,
    dailyProgress,
    wordsLearned,
    accuracyRate,
    completedCategories,
  } = useProgressStore();
  const theme = useTamaguiTheme();

  // Render onboarding directly if not completed
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  const progressPercentage =
    dailyGoal > 0 ? (dailyProgress / dailyGoal) * 100 : 0;
  const userName =
    user?.firstName ??
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ??
    "Learner";
  const isGoalComplete = progressPercentage >= 100;

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (!isSignedIn) {
      return "🌟 Sign in to track your progress and unlock all features!";
    }
    if (isGoalComplete) {
      return "🎉 Amazing work! You've completed your daily goal!";
    }
    if (progressPercentage >= 75) {
      return "🔥 You're almost there! Keep going!";
    }
    if (progressPercentage >= 50) {
      return "💪 Halfway there! Great progress!";
    }
    if (progressPercentage > 0) {
      return "✨ Keep it up! Every word counts!";
    }
    return "🌟 Ready to start learning? Let's begin!";
  };

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4" paddingTop="$2">
        {/* Hero Section */}
        <UICard tone="subtle" elevated>
          <YStack gap="$2" alignItems="center">
            <Text
              fontSize="$10"
              fontWeight="700"
              color="$primary"
              textAlign="center"
            >
              નમસ્તે {userName}! 👋
            </Text>
            <Text
              fontSize="$5"
              color="$foreground"
              opacity={0.8}
              textAlign="center"
            >
              Welcome to Gujarati Learning
            </Text>
            <Text fontSize="$4" color="$mutedForeground" textAlign="center">
              {getMotivationalMessage()}
            </Text>
          </YStack>
        </UICard>

        {/* XP Bar - Show for all users */}
        <XPBar showLevel size="md" />

        {/* Daily Goal Progress - Only show if signed in */}
        {isSignedIn && (
          <UICard elevated>
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <H3 color="$foreground">Daily Goal</H3>
                <Text fontSize="$5" fontWeight="600" color="$primary">
                  {dailyProgress} / {dailyGoal}
                </Text>
              </XStack>
              <Progress
                value={progressPercentage}
                max={100}
                backgroundColor="$muted"
                height={12}
                borderRadius="$2"
              >
                <Progress.Indicator
                  animation="bouncy"
                  backgroundColor="$primary"
                />
              </Progress>
              {isGoalComplete && (
                <XStack alignItems="center" gap="$2" justifyContent="center">
                  <Ionicons
                    name="trophy"
                    size={24}
                    color={theme.accent?.val ?? "#6366F1"}
                  />
                  <Text fontSize="$5" fontWeight="600" color="$accent">
                    Goal Complete! 🎉
                  </Text>
                </XStack>
              )}
            </YStack>
          </UICard>
        )}

        {/* Streak Display - Only show if signed in */}
        {isSignedIn && (
          <UICard tone="subtle" elevated>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1">
                <Text fontSize="$4" color="$mutedForeground">
                  Current Streak
                </Text>
                <XStack alignItems="center" gap="$2">
                  <Ionicons
                    name="flame"
                    size={32}
                    color={theme.primary?.val ?? "#2563EB"}
                  />
                  <Text fontSize="$8" fontWeight="700" color="$primary">
                    {currentStreak}
                  </Text>
                  <Text fontSize="$5" color="$foreground">
                    days 🔥
                  </Text>
                </XStack>
              </YStack>
            </XStack>
          </UICard>
        )}

        {/* Continue Learning Button */}
        <UIButton
          size="lg"
          variant="default"
          block
          onPress={() => router.push("/learn")}
          icon={
            <Ionicons
              name="play-circle"
              size={26}
              color={theme.primaryForeground?.val ?? "#F8FAFC"}
            />
          }
        >
          Continue Learning
        </UIButton>

        {/* Quick Actions */}
        <UICard elevated>
          <YStack gap="$3">
            <H3 color="$foreground">Quick Actions</H3>
            <XStack gap="$3" flexWrap="wrap">
              <UIButton
                flex={1}
                minWidth="45%"
                size="md"
                variant="secondary"
                onPress={() => router.push("/vocabulary")}
                icon={
                  <Ionicons
                    name="library"
                    size={22}
                    color={theme.secondaryForeground?.val ?? "#0F172A"}
                  />
                }
              >
                Vocabulary
              </UIButton>
              <UIButton
                flex={1}
                minWidth="45%"
                size="md"
                variant="accent"
                onPress={() => router.push("/learn")}
                icon={
                  <Ionicons
                    name="flash"
                    size={22}
                    color={theme.accentForeground?.val ?? "#0F172A"}
                  />
                }
              >
                Practice
              </UIButton>
              <UIButton
                flex={1}
                minWidth="45%"
                size="md"
                variant={isSignedIn ? "accent" : "subtle"}
                onPress={() =>
                  isSignedIn
                    ? router.push("/progress")
                    : router.push("/sign-in")
                }
                disabled={!isSignedIn}
                icon={
                  <Ionicons
                    name="stats-chart"
                    size={22}
                    color={
                      isSignedIn
                        ? theme.accentForeground?.val ?? "#0F172A"
                        : theme.mutedForeground?.val ?? "#94A3B8"
                    }
                  />
                }
              >
                Progress
              </UIButton>
              <UIButton
                flex={1}
                minWidth="45%"
                size="md"
                variant="accent"
                onPress={() => router.push("/vocabulary")}
                icon={
                  <Ionicons
                    name="refresh"
                    size={22}
                    color={theme.accentForeground?.val ?? "#0F172A"}
                  />
                }
              >
                Review
              </UIButton>
            </XStack>
          </YStack>
        </UICard>

        {/* Progress Overview - Only show if signed in */}
        {isSignedIn && (
          <UICard elevated>
            <YStack gap="$3">
              <H3 color="$foreground">Your Progress</H3>
              <XStack gap="$3" flexWrap="wrap">
                <UICard tone="subtle" elevated flex={1} minWidth="45%">
                  <YStack gap="$2" alignItems="center">
                    <Ionicons
                      name="book"
                      size={28}
                      color={theme.primary?.val ?? "#2563EB"}
                    />
                    <Text fontSize="$8" fontWeight="700" color="$primary">
                      {wordsLearned}
                    </Text>
                    <Text
                      fontSize="$3"
                      color="$mutedForeground"
                      textAlign="center"
                    >
                      Words Learned
                    </Text>
                  </YStack>
                </UICard>

                <UICard tone="subtle" elevated flex={1} minWidth="45%">
                  <YStack gap="$2" alignItems="center">
                    <Ionicons
                      name="stats-chart"
                      size={28}
                      color={theme.secondary?.val ?? "#F1F5F9"}
                    />
                    <Text fontSize="$8" fontWeight="700" color="$secondary">
                      {accuracyRate.toFixed(1)}%
                    </Text>
                    <Text
                      fontSize="$3"
                      color="$mutedForeground"
                      textAlign="center"
                    >
                      Accuracy Rate
                    </Text>
                  </YStack>
                </UICard>
              </XStack>
            </YStack>
          </UICard>
        )}

        {/* Completed Categories - Only show if signed in */}
        {isSignedIn && completedCategories.length > 0 && (
          <UICard elevated>
            <YStack gap="$3">
              <H3 color="$foreground">Completed Categories</H3>
              <XStack gap="$2" flexWrap="wrap">
                {completedCategories.map((category) => (
                  <Badge
                    key={category}
                    tone="muted"
                    size="sm"
                    label={`${category} ✓`}
                  />
                ))}
              </XStack>
            </YStack>
          </UICard>
        )}
      </YStack>
    </ScrollView>
  );
}
