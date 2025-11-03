import { useThemeContext } from '../providers/TamaguiProvider'

export function useTheme() {
  const { theme, themeMode, isDark, setTheme, toggleTheme } = useThemeContext()
  
  return {
    theme,
    themeMode,
    isDark,
    setTheme,
    toggleTheme,
  }
}

