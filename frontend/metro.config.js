const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')
const path = require('path')
const fs = require('fs')

const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
})

// Add mjs to source extensions
config.resolver.sourceExts.push('mjs')

// Configure resolver to handle Zustand CJS resolution (including submodules)
const originalResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force Zustand and all its submodules to use CJS build to avoid import.meta issues with Hermes
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    try {
      // Extract the submodule name (e.g., 'zustand/middleware' -> 'middleware')
      const submodule = moduleName === 'zustand' ? 'index' : moduleName.replace('zustand/', '')
      
      // Use path.resolve to get the absolute path to the CJS file
      const zustandDir = path.resolve(__dirname, 'node_modules/zustand')
      const zustandPath = path.join(zustandDir, `${submodule}.js`)
      
      // Check if file exists before returning
      if (fs.existsSync(zustandPath)) {
        return {
          filePath: zustandPath,
          type: 'sourceFile',
        }
      }
    } catch (error) {
      console.warn(`Could not resolve Zustand CJS for ${moduleName}:`, error.message)
    }
  }

  // Call original resolver for all other modules
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform)
  }
  // Fallback to default Metro resolver
  return context.resolveRequest(context, moduleName, platform)
}

// Disable package exports to prevent Metro from preferring ESM builds
// This forces all packages to use their main/module exports instead of package.json exports
config.resolver.unstable_enablePackageExports = false

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css',
})

