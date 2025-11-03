import React, { useState } from 'react'
import { View, Text, Button, Sheet, useTheme as useTamaguiTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../hooks/useTheme'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../store/authStore'
import { useAuth } from '@clerk/clerk-expo'

interface NavbarProps {
  title?: string
}

export function Navbar({ title = 'Gujarati Learning' }: NavbarProps) {
  const insets = useSafeAreaInsets()
  const { isDark, toggleTheme } = useTheme()
  const theme = useTamaguiTheme()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { isGuest } = useAuthStore()
  const { isSignedIn } = useAuth()

  const menuItems = [
    { label: 'Home', route: '/', icon: 'home', requiresAuth: false },
    { label: 'Lessons', route: '/learn', icon: 'book', requiresAuth: false },
    { label: 'Vocabulary', route: '/vocabulary', icon: 'library', requiresAuth: false },
    { label: 'Practice', route: '/learn', icon: 'flash', requiresAuth: false },
    { label: 'Progress', route: '/progress', icon: 'stats-chart', requiresAuth: true },
    { label: 'Settings', route: '/settings', icon: 'settings', requiresAuth: false },
  ]

  const handleNavigation = (route: string, requiresAuth: boolean) => {
    setMenuOpen(false)
    
    // Check if route requires authentication
    if (requiresAuth && isGuest && !isSignedIn) {
      router.push('/sign-in')
      return
    }
    
    if (route === '/') {
      router.replace('/')
    } else {
      router.push(route as any)
    }
  }

  return (
    <>
      <View
        bg="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingTop={insets.top}
        paddingHorizontal="$4"
        paddingBottom="$3"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        elevation={2}
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        {/* Menu Button */}
        <Button
          size="$4"
          circular
          chromeless
          onPress={() => setMenuOpen(true)}
          icon={
            <Ionicons
              name="menu"
              size={24}
              color={theme.color?.val || '#000'}
            />
          }
          pressStyle={{ opacity: 0.7 }}
        />

        {/* App Title */}
        <Text
          fontSize="$6"
          fontWeight="600"
          color="$color"
          flex={1}
          textAlign="center"
        >
          {title}
        </Text>

        {/* Dark Mode Toggle */}
        <Button
          size="$4"
          circular
          chromeless
          onPress={toggleTheme}
          icon={
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={24}
              color={theme.color?.val || '#000'}
            />
          }
          pressStyle={{ opacity: 0.7 }}
        />
      </View>

      {/* Menu Sheet */}
      <Sheet
        modal
        open={menuOpen}
        onOpenChange={setMenuOpen}
        snapPoints={[85]}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame
          bg="$background"
          padding="$4"
          paddingTop={insets.top}
        >
          <View gap="$3">
            <Text fontSize="$8" fontWeight="700" color="$color" marginBottom="$2">
              Menu
            </Text>
            {menuItems.map((item) => {
              const isDisabled = item.requiresAuth && isGuest && !isSignedIn;
              return (
                <Button
                  key={item.route}
                  size="$5"
                  justifyContent="flex-start"
                  bg="$background"
                  borderWidth={0}
                  borderRadius="$4"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  onPress={() => handleNavigation(item.route, item.requiresAuth)}
                  disabled={isDisabled}
                  opacity={isDisabled ? 0.5 : 1}
                  pressStyle={{ bg: '$backgroundHover', opacity: 0.8 }}
                  icon={
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={theme.color?.val || '#000'}
                    />
                  }
                >
                  <Text fontSize="$5" color="$color" marginLeft="$3">
                    {item.label}
                    {isDisabled && ' (Sign In Required)'}
                  </Text>
                </Button>
              );
            })}
          </View>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
