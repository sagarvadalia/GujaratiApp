import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...defaultConfig,
  // Extend media queries if needed
  media: {
    ...defaultConfig.media,
    // Add custom media queries here if needed
  },
  // Themes are already included in defaultConfig (light/dark)
  // But you can extend them if needed:
  themes: {
    ...defaultConfig.themes,
    // Extend themes here if you want custom colors
  },
})

type OurConfig = typeof config

// Make TypeScript aware of your custom config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends OurConfig {}
}

export default config

