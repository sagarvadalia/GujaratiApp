import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useSegments } from 'expo-router';
import { View, Text, Spinner } from 'tamagui';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { isGuest, setUser, setGuestMode } = useAuthStore();

  React.useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !isGuest && !inAuthGroup) {
      // Redirect to sign-in if not authenticated and not in guest mode
      router.replace('/sign-in');
    } else if (isSignedIn && userId) {
      // Update auth store with user info
      setUser({
        id: userId,
      });
    }
  }, [isLoaded, isSignedIn, userId, isGuest, segments]);

  if (!isLoaded) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" bg="$background">
        <Spinner size="large" />
      </View>
    );
  }

  // Allow access if signed in or in guest mode
  if (isSignedIn || isGuest) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  return (
    <View flex={1} justifyContent="center" alignItems="center" bg="$background">
      <Spinner size="large" />
    </View>
  );
}

