import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { type ComponentProps, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Popover,
  Sheet,
  Text,
  useTheme as useTamaguiTheme,
  View,
  XStack,
  YStack,
} from "tamagui";

import { useTheme } from "../hooks/useTheme";
import { useAuthStore } from "../store/authStore";
import { type DisplayMode, useVocabularyStore } from "../store/vocabularyStore";
import { Button as UIButton, IconButton, ToggleButton } from "./ui";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type MenuItem = {
  label: string;
  route: Href;
  icon: IoniconName;
  requiresAuth: boolean;
};

type DisplayModeOption = {
  mode: DisplayMode;
  label: string;
  icon: IoniconName;
};

interface NavbarProps {
  title?: string;
}

export function Navbar({ title = "Gujarati Learning" }: NavbarProps) {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();
  const theme = useTamaguiTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayModeOpen, setDisplayModeOpen] = useState(false);
  const { isGuest } = useAuthStore();
  const { isSignedIn } = useAuth();
  const { displayMode, setDisplayMode } = useVocabularyStore();

  const menuItems = [
    { label: "Home", route: "/", icon: "home", requiresAuth: false },
    { label: "Lessons", route: "/learn", icon: "book", requiresAuth: false },
    {
      label: "Vocabulary",
      route: "/vocabulary",
      icon: "library",
      requiresAuth: false,
    },
    { label: "Practice", route: "/learn", icon: "flash", requiresAuth: false },
    {
      label: "Progress",
      route: "/progress",
      icon: "stats-chart",
      requiresAuth: true,
    },
    {
      label: "Settings",
      route: "/settings",
      icon: "settings",
      requiresAuth: false,
    },
  ] satisfies MenuItem[];

  const handleNavigation = (route: Href, requiresAuth: boolean) => {
    setMenuOpen(false);

    // Check if route requires authentication
    if (requiresAuth && isGuest && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (route === "/") {
      router.replace("/");
    } else {
      router.push(route);
    }
  };

  const displayModeOptions = [
    { mode: "gujarati", label: "Gujarati", icon: "globe" },
    { mode: "english", label: "English", icon: "text" },
    { mode: "both", label: "Both", icon: "layers" },
  ] satisfies DisplayModeOption[];

  const currentDisplayMode =
    displayModeOptions.find((opt) => opt.mode === displayMode) ??
    displayModeOptions[2];

  return (
    <>
      <View
        backgroundColor="$card"
        borderBottomWidth={1}
        borderBottomColor="$border"
        paddingTop={insets.top}
        paddingHorizontal="$4"
        paddingBottom="$3"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        style={{ elevation: 2 }}
      >
        {/* Menu Button */}
        <IconButton
          variant="ghost"
          onPress={() => setMenuOpen(true)}
          icon={
            <Ionicons
              name="menu"
              size={22}
              color={theme.color?.val ?? "#000"}
            />
          }
        />

        {/* App Title */}
        <Text
          fontSize="$6"
          fontWeight="600"
          color="$foreground"
          flex={1}
          textAlign="center"
        >
          {title}
        </Text>

        {/* Display Mode Dropdown & Dark Mode Toggle */}
        <XStack gap="$2" alignItems="center">
          <Popover open={displayModeOpen} onOpenChange={setDisplayModeOpen}>
            <Popover.Trigger asChild>
              <UIButton
                variant="ghost"
                size="sm"
                borderRadius="$6"
                paddingHorizontal="$3"
                paddingVertical="$2"
              >
                <XStack alignItems="center" gap="$1">
                  <Ionicons
                    name={currentDisplayMode.icon}
                    size={18}
                    color={theme.color?.val ?? "#000"}
                  />
                  <Text fontSize="$3" color="$color" fontWeight="600">
                    {currentDisplayMode.label}
                  </Text>
                  <Ionicons
                    name={displayModeOpen ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={theme.color?.val ?? "#000"}
                  />
                </XStack>
              </UIButton>
            </Popover.Trigger>
            <Popover.Content
              borderWidth={1}
              borderColor="$border"
              borderRadius="$6"
              padding="$2"
              backgroundColor="$card"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
            >
              <YStack gap="$1">
                {displayModeOptions.map((option) => {
                  const isSelected = displayMode === option.mode;
                  return (
                    <ToggleButton
                      key={option.mode}
                      size="sm"
                      isActive={isSelected}
                      variant={isSelected ? "secondary" : "ghost"}
                      justifyContent="flex-start"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      onPress={() => {
                        setDisplayMode(option.mode);
                        setDisplayModeOpen(false);
                      }}
                    >
                      <XStack alignItems="center" gap="$2">
                        <Ionicons
                          name={option.icon}
                          size={18}
                          color={
                            isSelected
                              ? theme.secondaryForeground?.val ?? "#fff"
                              : theme.color?.val ?? "#000"
                          }
                        />
                        <Text
                          fontSize="$4"
                          color={isSelected ? "$secondaryForeground" : "$color"}
                          fontWeight={isSelected ? "600" : "500"}
                        >
                          {option.label}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={theme.secondaryForeground?.val ?? "#fff"}
                          />
                        )}
                      </XStack>
                    </ToggleButton>
                  );
                })}
              </YStack>
            </Popover.Content>
          </Popover>
          <IconButton
            variant="ghost"
            onPress={toggleTheme}
            icon={
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={22}
                color={theme.color?.val ?? "#000"}
              />
            }
          />
        </XStack>
      </View>

      {/* Menu Sheet */}
      <Sheet
        modal
        open={menuOpen}
        onOpenChange={setMenuOpen}
        snapPoints={["85%"]}
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
        <Sheet.Frame backgroundColor="$card" padding="$5" paddingTop={insets.top}>
          <View gap="$3">
            <Text
              fontSize="$8"
              fontWeight="700"
              color="$color"
              marginBottom="$2"
            >
              Menu
            </Text>
            {menuItems.map((item) => {
              const isDisabled = item.requiresAuth && isGuest && !isSignedIn;
              return (
                <UIButton
                  key={item.label}
                  variant="ghost"
                  size="lg"
                  justifyContent="flex-start"
                  borderRadius="$6"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  onPress={() =>
                    handleNavigation(item.route, item.requiresAuth)
                  }
                  disabled={isDisabled}
                  opacity={isDisabled ? 0.5 : 1}
                  icon={
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={theme.color?.val ?? "#000"}
                    />
                  }
                >
                  <Text fontSize="$5" color="$color" marginLeft="$3">
                    {item.label}
                    {isDisabled && " (Sign In Required)"}
                  </Text>
                </UIButton>
              );
            })}
          </View>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
