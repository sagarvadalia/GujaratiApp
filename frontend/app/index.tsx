import { View, Text, ScrollView } from 'tamagui';
import { useAuthStore } from '../store/authStore';
import { Onboarding } from '../components/auth/Onboarding';

export default function Index() {
  const { hasCompletedOnboarding } = useAuthStore();

  // Render onboarding directly if not completed, instead of navigating
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <View gap="$4" paddingTop="$2">
        <Text fontSize="$9" fontWeight="700" color="$color" marginBottom="$2">
          Welcome to Gujarati Learning
        </Text>
        <Text fontSize="$5" color="$color" opacity={0.8}>
          Start your journey learning Gujarati language with interactive lessons,
          vocabulary practice, and progress tracking.
        </Text>
      </View>
    </ScrollView>
  );
}

