import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "tamagui";

import { Navbar } from "../components/Navbar";
import { QueryProvider } from "../providers/QueryProvider";
import { TamaguiProvider } from "../providers/TamaguiProvider";
import { TRPCProvider } from "../providers/TRPCProvider";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <TamaguiProvider>
        <QueryProvider>
          <TRPCProvider>
            <SafeAreaProvider>
              <View flex={1} backgroundColor="$background">
                <Navbar />
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
              </View>
            </SafeAreaProvider>
          </TRPCProvider>
        </QueryProvider>
      </TamaguiProvider>
    </ClerkProvider>
  );
}
