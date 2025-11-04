import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import { Alert } from "react-native";
import { Text, YStack } from "tamagui";

import { Button as UIButton } from "../../components/ui";
import { useAuthStore } from "../../store/authStore";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const { setGuestMode } = useAuthStore();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignUp = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        setGuestMode(false);
        router.replace("/");
      }
    } catch (error) {
      console.error("Google sign-up failed", error);
      Alert.alert("Sign up failed", "Please try again later.");
    }
  }, [router, setGuestMode, startOAuthFlow]);

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
            Create an Account
          </Text>
          <Text fontSize="$4" color="$mutedForeground" textAlign="center">
            Join Gujarati Learning to save your progress across devices.
          </Text>
        </YStack>

        <UIButton
          size="lg"
          variant="accent"
          onPress={handleGoogleSignUp}
          icon={<Ionicons name="logo-google" size={22} color="#0F172A" />}
        >
          Sign Up with Google
        </UIButton>

        <UIButton variant="outline" onPress={() => router.push("/sign-in")}>
          Already have an account? Sign In
        </UIButton>
      </YStack>
    </YStack>
  );
}
