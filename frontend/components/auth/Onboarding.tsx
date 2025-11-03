import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, YStack, XStack, H3 } from 'tamagui';
import { useAuthStore } from '../../store/authStore';

export function Onboarding() {
  const router = useRouter();
  const { setOnboardingComplete, setGuestMode } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Gujarati Learning!',
      description: 'Learn Gujarati with interactive lessons, vocabulary practice, and fun quizzes.',
      icon: '👋',
    },
    {
      title: 'Learn Vocabulary',
      description: 'Master Gujarati words with pronunciation guides and English translations.',
      icon: '📚',
    },
    {
      title: 'Practice with Quizzes',
      description: 'Test your knowledge with interactive quizzes and track your progress.',
      icon: '🎯',
    },
    {
      title: 'Track Your Progress',
      description: 'Build streaks, set daily goals, and see your learning statistics.',
      icon: '📊',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setOnboardingComplete(true);
    router.replace('/');
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    setOnboardingComplete(true);
    router.replace('/');
  };

  return (
    <View flex={1} bg="$background" justifyContent="center" alignItems="center" padding="$4">
      <YStack gap="$6" alignItems="center" width="100%" maxWidth={400}>
        <Text fontSize="$12" marginBottom="$2">
          {steps[currentStep].icon}
        </Text>
        
        <H3 textAlign="center" color="$foreground">
          {steps[currentStep].title}
        </H3>
        
        <Text fontSize="$5" textAlign="center" color="$foreground" opacity={0.8}>
          {steps[currentStep].description}
        </Text>

        <XStack gap="$3" marginTop="$4">
          {currentStep > 0 && (
            <Button
              variant="outlined"
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
          )}
          <Button
            onPress={handleNext}
            flex={1}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </XStack>

        <XStack gap="$2" marginTop="$4">
          <Button
            variant="outlined"
            size="$3"
            onPress={handleSkip}
          >
            Skip
          </Button>
          <Button
            variant="outlined"
            size="$3"
            onPress={handleGuestMode}
          >
            Continue as Guest
          </Button>
        </XStack>

        <XStack gap="$2" marginTop="$4">
          {steps.map((_, index) => (
            <View
              key={index}
              width={8}
              height={8}
              borderRadius={4}
              bg={index === currentStep ? '$primary' : '$muted'}
            />
          ))}
        </XStack>
      </YStack>
    </View>
  );
}

