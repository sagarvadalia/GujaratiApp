export type ThemeMode = "light" | "dark"

export type SemanticTheme = {
  background: string
  backgroundHover: string
  backgroundPressed: string
  backgroundFocused: string
  foreground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  border: string
  divider: string
  input: string
  ring: string
  shadowColor: string
  shadowColorStrong: string
  overlay: string
  primary: string
  primaryForeground: string
  primaryHover: string
  primaryPressed: string
  secondary: string
  secondaryForeground: string
  secondaryHover: string
  secondaryPressed: string
  destructive: string
  destructiveForeground: string
  destructiveHover: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  info: string
  infoForeground: string
  highlight: string
  focus: string
  color: string
  colorMuted: string
  borderColor: string
  gray1: string
  gray2: string
  gray3: string
  gray4: string
  gray5: string
  gray6: string
  gray7: string
  gray8: string
  gray9: string
  gray10: string
  gray11: string
  gray12: string
}

const lightPalette: SemanticTheme = {
  background: "#FFF8EF",
  backgroundHover: "#FFEBD1",
  backgroundPressed: "#F7D9B5",
  backgroundFocused: "#F7D9B5",
  foreground: "#2A1500",
  muted: "#FFF1E1",
  mutedForeground: "#7A5836",
  accent: "#F2E8FF",
  accentForeground: "#30145A",
  card: "#FFF8EF",
  cardForeground: "#2A1500",
  popover: "#FFF8EF",
  popoverForeground: "#2A1500",
  border: "#F2D6B4",
  divider: "#E8C79F",
  input: "#F4DEC1",
  ring: "#B34700",
  shadowColor: "rgba(65, 32, 4, 0.12)",
  shadowColorStrong: "rgba(65, 32, 4, 0.2)",
  overlay: "rgba(58, 32, 12, 0.3)",
  primary: "#B34700",
  primaryForeground: "#FFF8EF",
  primaryHover: "#993A00",
  primaryPressed: "#7A2E00",
  secondary: "#0F6B3A",
  secondaryForeground: "#F1F8F4",
  secondaryHover: "#0A5A2F",
  secondaryPressed: "#084424",
  destructive: "#B3261E",
  destructiveForeground: "#FCECEA",
  destructiveHover: "#951A17",
  success: "#1B8A3C",
  successForeground: "#F1F9F4",
  warning: "#E58E26",
  warningForeground: "#2A1500",
  info: "#1F6FA3",
  infoForeground: "#F0F7FC",
  highlight: "#FFEFD9",
  focus: "#B34700",
  color: "#2A1500",
  colorMuted: "#7A5836",
  borderColor: "#E8C79F",
  gray1: "#FFF8EF",
  gray2: "#FFEBD1",
  gray3: "#F7D9B5",
  gray4: "#EFC18F",
  gray5: "#D7A16D",
  gray6: "#B4814F",
  gray7: "#8D613C",
  gray8: "#704B2E",
  gray9: "#54361F",
  gray10: "#3B2415",
  gray11: "#2A150F",
  gray12: "#1E0D09",
}

const darkPalette: SemanticTheme = {
  background: "#130A04",
  backgroundHover: "#1F1309",
  backgroundPressed: "#2A1B10",
  backgroundFocused: "#2A1B10",
  foreground: "#FCEFE6",
  muted: "#1C120B",
  mutedForeground: "#D9BFA9",
  accent: "#251A3D",
  accentForeground: "#F0E8FF",
  card: "#1A1008",
  cardForeground: "#FCEFE6",
  popover: "#1A1008",
  popoverForeground: "#FCEFE6",
  border: "#2E1C12",
  divider: "#372419",
  input: "#2E1C12",
  ring: "#FF9E2C",
  shadowColor: "rgba(8, 4, 2, 0.55)",
  shadowColorStrong: "rgba(8, 4, 2, 0.7)",
  overlay: "rgba(10, 6, 2, 0.7)",
  primary: "#FF9E2C",
  primaryForeground: "#1A0F08",
  primaryHover: "#F28705",
  primaryPressed: "#D46A00",
  secondary: "#38B174",
  secondaryForeground: "#04150C",
  secondaryHover: "#2A915D",
  secondaryPressed: "#1E6B45",
  destructive: "#FF6B60",
  destructiveForeground: "#1A0A09",
  destructiveHover: "#F0473A",
  success: "#44C86C",
  successForeground: "#05140A",
  warning: "#FFBE4D",
  warningForeground: "#1A0F05",
  info: "#3BA7D3",
  infoForeground: "#051018",
  highlight: "#2A1B10",
  focus: "#FF9E2C",
  color: "#FCEFE6",
  colorMuted: "#D9BFA9",
  borderColor: "#372419",
  gray1: "#130A04",
  gray2: "#1B1008",
  gray3: "#24160C",
  gray4: "#2E1C12",
  gray5: "#3A2517",
  gray6: "#4B311F",
  gray7: "#604129",
  gray8: "#7A5536",
  gray9: "#9C6F45",
  gray10: "#C68D5A",
  gray11: "#E0B481",
  gray12: "#F6D8B4",
}

export const semanticPalettes: Record<ThemeMode, SemanticTheme> = {
  light: lightPalette,
  dark: darkPalette,
}

export const getSemanticTheme = (mode: ThemeMode): SemanticTheme => {
  return semanticPalettes[mode]
}

export const themeRadii = {
  sm: 6,
  md: 12,
  lg: 18,
  pill: 999,
}

export const themeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
}

