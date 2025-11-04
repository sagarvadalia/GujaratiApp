import { StatusBar } from "expo-status-bar";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider as BaseTamaguiProvider, Theme } from "tamagui";

import { getSemanticTheme } from "../constants/theme";
import { config } from "../tamagui.config";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: "light" | "dark";
  themeMode: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within TamaguiProvider");
  }
  return context;
}

interface TamaguiProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark";
}

export function TamaguiProvider({
  children,
  defaultTheme,
}: TamaguiProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    defaultTheme ?? "system",
  );
  const [theme, setThemeState] = useState<"light" | "dark">(
    defaultTheme ?? systemColorScheme ?? "light",
  );

  // Update theme based on themeMode
  useEffect(() => {
    if (themeMode === "system") {
      setThemeState(systemColorScheme ?? "light");
    } else {
      setThemeState(themeMode);
    }
  }, [systemColorScheme, themeMode]);

  // Update theme when system color scheme changes (if in system mode)
  useEffect(() => {
    if (!defaultTheme && themeMode === "system" && systemColorScheme) {
      setThemeState(systemColorScheme);
    }
  }, [defaultTheme, systemColorScheme, themeMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
  };

  const toggleTheme = () => {
    const currentTheme = themeMode === "system"
      ? systemColorScheme ?? "light"
      : themeMode;

    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const contextValue: ThemeContextValue = {
    theme,
    themeMode,
    isDark: theme === "dark",
    setTheme,
    toggleTheme,
  };

  const activePalette = getSemanticTheme(theme);

  return (
    <ThemeContext.Provider value={contextValue}>
      <BaseTamaguiProvider config={config} defaultTheme={theme}>
        <Theme name={theme}>
          <StatusBar
            style={contextValue.isDark ? "light" : "dark"}
            backgroundColor={activePalette.background}
          />
          {children}
        </Theme>
      </BaseTamaguiProvider>
    </ThemeContext.Provider>
  );
}

