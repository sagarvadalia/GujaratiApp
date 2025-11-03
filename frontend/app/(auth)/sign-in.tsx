import React from "react";
import { useAuth , SignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View, Text, Button, YStack, XStack } from "tamagui";

export default function SignInScreen() {
  const router = useRouter();

  return (
    <View
      flex={1}
      bg="$background"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      <YStack gap="$4" width="100%" maxWidth={400}>
        <Text
          fontSize="$8"
          fontWeight="700"
          textAlign="center"
          marginBottom="$4"
        >
          Welcome Back
        </Text>
        <SignIn routing="hash" afterSignInUrl="/" signUpUrl="/sign-up" />
        <XStack justifyContent="center" marginTop="$4">
          <Button variant="outlined" onPress={() => router.push("/sign-up")}>
            Don&apos;t have an account? Sign Up
          </Button>
        </XStack>
      </YStack>
    </View>
  );
}
