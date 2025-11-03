import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

import { themeRadii, themeSpacing, getSemanticTheme } from "./constants/theme";

type ThemeMode = "light" | "dark";

const mapSemanticTheme = (mode: ThemeMode) => {
  const palette = getSemanticTheme(mode);

  return {
    ...defaultConfig.themes[mode],
    ...palette,
    backgroundPress: palette.backgroundPressed,
    backgroundFocus: palette.backgroundFocused,
    outlineColor: palette.focus,
    focusColor: palette.focus,
    placeholderColor: palette.mutedForeground,
    shadowColor: palette.shadowColor,
    shadowColorStrong: palette.shadowColorStrong,
    color: palette.color,
    borderColor: palette.borderColor,
  };
};

export const config = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: mapSemanticTheme("light"),
    dark: mapSemanticTheme("dark"),
  },
  tokens: {
    ...defaultConfig.tokens,
    radius: {
      ...defaultConfig.tokens.radius,
      sm: themeRadii.sm,
      md: themeRadii.md,
      lg: themeRadii.lg,
      pill: themeRadii.pill,
    },
    space: {
      ...defaultConfig.tokens.space,
      xs: themeSpacing.xs,
      sm: themeSpacing.sm,
      md: themeSpacing.md,
      lg: themeSpacing.lg,
      xl: themeSpacing.xl,
    },
  },
});

type OurConfig = typeof config;

// Make TypeScript aware of your custom config
declare module "tamagui" {
  interface TamaguiCustomConfig extends OurConfig {}
}

export default config;
