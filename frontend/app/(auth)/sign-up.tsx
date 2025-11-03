import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, YStack, XStack } from 'tamagui';
import { SignUp } from '@clerk/clerk-expo';

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View flex={1} bg="$background" justifyContent="center" alignItems="center" padding="$4">
      <YStack gap="$4" width="100%" maxWidth={400}>
        <Text fontSize="$8" fontWeight="700" textAlign="center" marginBottom="$4">
          Get Started
        </Text>
        <SignUp 
          routing="hash"
          afterSignUpUrl="/"
          signInUrl="/sign-in"
        />
        <XStack justifyContent="center" marginTop="$4">
          <Button
            variant="outlined"
            onPress={() => router.push('/sign-in')}
          >
            Already have an account? Sign In
          </Button>
        </XStack>
      </YStack>
    </View>
  );
}

