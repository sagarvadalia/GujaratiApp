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
  background: "#FFFFFF",
  backgroundHover: "#F8FAFC",
  backgroundPressed: "#E2E8F0",
  backgroundFocused: "#E2E8F0",
  foreground: "#0F172A",
  muted: "#F8FAFC",
  mutedForeground: "#64748B",
  accent: "#F1F5F9",
  accentForeground: "#0F172A",
  card: "#FFFFFF",
  cardForeground: "#0F172A",
  popover: "#FFFFFF",
  popoverForeground: "#0F172A",
  border: "#E2E8F0",
  divider: "#E2E8F0",
  input: "#E2E8F0",
  ring: "#2563EB",
  shadowColor: "rgba(15, 23, 42, 0.08)",
  shadowColorStrong: "rgba(15, 23, 42, 0.16)",
  overlay: "rgba(15, 23, 42, 0.2)",
  primary: "#2563EB",
  primaryForeground: "#F8FAFC",
  primaryHover: "#1D4ED8",
  primaryPressed: "#1E3A8A",
  secondary: "#F1F5F9",
  secondaryForeground: "#0F172A",
  secondaryHover: "#E2E8F0",
  secondaryPressed: "#CBD5F5",
  destructive: "#DC2626",
  destructiveForeground: "#F8FAFC",
  destructiveHover: "#B91C1C",
  success: "#16A34A",
  successForeground: "#F0FDF4",
  warning: "#F59E0B",
  warningForeground: "#111827",
  info: "#0EA5E9",
  infoForeground: "#F8FAFC",
  highlight: "#EEF2FF",
  focus: "#1D4ED8",
  color: "#0F172A",
  colorMuted: "#64748B",
  borderColor: "#E2E8F0",
  gray1: "#F9FAFB",
  gray2: "#F3F4F6",
  gray3: "#E5E7EB",
  gray4: "#D1D5DB",
  gray5: "#9CA3AF",
  gray6: "#6B7280",
  gray7: "#4B5563",
  gray8: "#374151",
  gray9: "#1F2937",
  gray10: "#111827",
  gray11: "#0B1220",
  gray12: "#020617",
}

const darkPalette: SemanticTheme = {
  background: "#020817",
  backgroundHover: "#0F172A",
  backgroundPressed: "#1E293B",
  backgroundFocused: "#1E293B",
  foreground: "#E2E8F0",
  muted: "#111827",
  mutedForeground: "#94A3B8",
  accent: "#1E293B",
  accentForeground: "#E2E8F0",
  card: "#0F172A",
  cardForeground: "#E2E8F0",
  popover: "#0F172A",
  popoverForeground: "#E2E8F0",
  border: "#1E293B",
  divider: "#1E293B",
  input: "#1E293B",
  ring: "#60A5FA",
  shadowColor: "rgba(2, 8, 23, 0.48)",
  shadowColorStrong: "rgba(2, 8, 23, 0.64)",
  overlay: "rgba(2, 8, 23, 0.72)",
  primary: "#60A5FA",
  primaryForeground: "#020817",
  primaryHover: "#3B82F6",
  primaryPressed: "#2563EB",
  secondary: "#1E293B",
  secondaryForeground: "#E2E8F0",
  secondaryHover: "#334155",
  secondaryPressed: "#475569",
  destructive: "#F87171",
  destructiveForeground: "#0F172A",
  destructiveHover: "#EF4444",
  success: "#22C55E",
  successForeground: "#022C22",
  warning: "#FBBF24",
  warningForeground: "#0F172A",
  info: "#38BDF8",
  infoForeground: "#020817",
  highlight: "#1E293B",
  focus: "#38BDF8",
  color: "#E2E8F0",
  colorMuted: "#94A3B8",
  borderColor: "#1E293B",
  gray1: "#020617",
  gray2: "#0B1220",
  gray3: "#111827",
  gray4: "#1E293B",
  gray5: "#27324D",
  gray6: "#334155",
  gray7: "#475569",
  gray8: "#64748B",
  gray9: "#94A3B8",
  gray10: "#CBD5F5",
  gray11: "#E2E8F0",
  gray12: "#F1F5F9",
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

