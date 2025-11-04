import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

import { getSemanticTheme, themeRadii, themeSpacing } from "./constants/theme";

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
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
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
    size: {
      ...defaultConfig.tokens.size,
      sm: 36,
      md: 44,
      lg: 52,
    },
  },
});

type OurConfig = typeof config;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Required for Tamagui type augmentation
  interface TamaguiCustomConfig extends OurConfig {}
}

export default config;
