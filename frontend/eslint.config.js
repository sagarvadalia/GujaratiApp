// https://docs.expo.dev/guides/using-eslint/
const path = require("node:path");
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const { createBaseConfig } = require("../eslint.base");

module.exports = defineConfig([
  ...createBaseConfig({
    tsconfigPath: path.join(__dirname, "tsconfig.json"),
    reactNative: true,
    excludePlugins: ["import", "react", "react-hooks", "react-native", "@typescript-eslint"],
  }),
  ...expoConfig,
  {
    name: "frontend/react-19-overrides",
    rules: {
      "import/no-named-as-default-member": "off",
    },
  },
  {
    name: "frontend/overrides",
    ignores: ["dist/**", "build/**", ".tamagui/**", "eslint.config.js"],
  },
]);
