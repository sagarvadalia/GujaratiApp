import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryProvider } from "../providers/QueryProvider";
import { TRPCProvider } from "../providers/TRPCProvider";
import { TamaguiProvider } from "../providers/TamaguiProvider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Navbar } from "../components/Navbar";
import { View } from "tamagui";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <TamaguiProvider>
        <QueryProvider>
          <TRPCProvider>
            <SafeAreaProvider>
              <View flex={1} bg="$background">
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
