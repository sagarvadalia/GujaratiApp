import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import { Alert } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { Button as UIButton } from "../../components/ui";
import { useAuthStore } from "../../store/authStore";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const { setGuestMode } = useAuthStore();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleAuth = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        setGuestMode(false);
        router.replace("/");
      }
    } catch (error) {
      console.error("Google sign-in failed", error);
      Alert.alert("Sign in failed", "Please try again or use another method.");
    }
  }, [router, setGuestMode, startOAuthFlow]);

  const handleContinueAsGuest = useCallback(() => {
    setGuestMode(true);
    router.replace("/");
  }, [router, setGuestMode]);

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      <YStack gap="$5" width="100%" maxWidth={400}>
        <YStack gap="$2" alignItems="center">
          <Text fontSize="$9" fontWeight="700" textAlign="center">
            Welcome Back
          </Text>
          <Text fontSize="$4" color="$mutedForeground" textAlign="center">
            Sign in to continue learning and track your progress.
          </Text>
        </YStack>

        <UIButton
          size="lg"
          variant="accent"
          onPress={handleGoogleAuth}
          icon={<Ionicons name="logo-google" size={22} color="#0F172A" />}
        >
          Continue with Google
        </UIButton>

        <XStack justifyContent="center">
          <UIButton variant="outline" onPress={() => router.push("/sign-up")}>
            Don&apos;t have an account? Sign Up
          </UIButton>
        </XStack>

        <XStack justifyContent="center">
          <UIButton variant="ghost" onPress={handleContinueAsGuest}>
            Continue as Guest
          </UIButton>
        </XStack>
      </YStack>
    </YStack>
  );
}
