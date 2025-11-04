const path = require("node:path");
const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactNativePlugin = require("eslint-plugin-react-native");
const importPlugin = require("eslint-plugin-import");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");

const IGNORE_PATTERNS = [
  "**/.expo/**",
  "**/.turbo/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/node_modules/**",
];

const COMMON_RULES = {
  "no-console": ["warn", { allow: ["warn", "error", "info"] }],
  "no-undef": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "unused-imports/no-unused-imports": "warn",
  "unused-imports/no-unused-vars": [
    "warn",
    {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
      ignoreRestSiblings: true,
      destructuredArrayIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/consistent-type-imports": [
    "warn",
    {
      prefer: "type-imports",
      fixStyle: "inline-type-imports",
      disallowTypeAnnotations: false,
    },
  ],
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-empty-interface": "warn",
  "@typescript-eslint/ban-ts-comment": [
    "warn",
    { "ts-ignore": "allow-with-description" },
  ],
  "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
  "simple-import-sort/imports": "warn",
  "simple-import-sort/exports": "warn",
  "import/order": "off",
  "import/no-unresolved": "off",
  "import/named": "off",
  "import/no-extraneous-dependencies": "off",
};

const REACT_NATIVE_RULES = {
  "react/jsx-uses-react": "off",
  "react/react-in-jsx-scope": "off",
  "react/jsx-curly-brace-presence": [
    "warn",
    { props: "never", children: "never", propElementValues: "always" },
  ],
  "react/jsx-no-duplicate-props": ["error", { ignoreCase: false }],
  "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "react-native/no-inline-styles": "warn",
  "react-native/no-unused-styles": "warn",
  "react-native/no-single-element-style-arrays": "warn",
  "react-native/no-raw-text": "off",
  "react-native/split-platform-components": "warn",
};

const NODE_RULES = {
  "@typescript-eslint/no-var-requires": "off",
  "@typescript-eslint/no-require-imports": "off",
};

const TYPE_AWARE_RULES = {
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      checksVoidReturn: {
        arguments: false,
        attributes: false,
      },
    },
  ],
  "@typescript-eslint/prefer-nullish-coalescing": [
    "warn",
    {
      ignoreMixedLogicalExpressions: true,
      ignoreTernaryTests: false,
      ignoreConditionalTests: true,
    },
  ],
  "@typescript-eslint/prefer-optional-chain": "warn",
  "@typescript-eslint/no-unnecessary-type-assertion": "warn",
  "@typescript-eslint/no-confusing-void-expression": [
    "warn",
    { ignoreArrowShorthand: true, ignoreVoidOperator: true },
  ],
  "@typescript-eslint/restrict-template-expressions": [
    "warn",
    { allowBoolean: true, allowNumber: true, allowNullish: true },
  ],
};

function createBaseConfig(options = {}) {
  const { tsconfigPath, reactNative = false, excludePlugins = [] } = options;
  const tsconfigRootDir = tsconfigPath ? path.dirname(tsconfigPath) : undefined;
  const excluded = new Set(excludePlugins);

  const pluginDefinitions = {
    "@typescript-eslint": tsPlugin,
    import: importPlugin,
    "simple-import-sort": simpleImportSortPlugin,
    "unused-imports": unusedImportsPlugin,
    ...(reactNative
      ? {
          react: reactPlugin,
          "react-hooks": reactHooksPlugin,
          "react-native": reactNativePlugin,
        }
      : {}),
  };

  for (const pluginKey of excluded) {
    delete pluginDefinitions[pluginKey];
  }

  const baseRules = {
    ...COMMON_RULES,
    ...(reactNative ? REACT_NATIVE_RULES : NODE_RULES),
  };

  const filteredRules = Object.fromEntries(
    Object.entries(baseRules).filter(([ruleName]) => {
      const slashIndex = ruleName.indexOf("/");
      if (slashIndex === -1) {
        return true;
      }

      const pluginName = ruleName.slice(0, slashIndex);
      return !excluded.has(pluginName);
    })
  );

  const baseConfig = {
    name: "shared/base",
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: IGNORE_PATTERNS,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: reactNative
        ? { ...globals.es2021, ...globals.browser }
        : { ...globals.es2021, ...globals.node },
    },
    plugins: pluginDefinitions,
    settings: {
      ...(reactNative ? { react: { version: "detect" } } : {}),
      "import/resolver": {
        typescript: {
          project: tsconfigPath ? [tsconfigPath] : undefined,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: filteredRules,
  };

  const typeAwareConfigs =
    tsconfigPath && !excluded.has("@typescript-eslint")
      ? [
          {
            name: "shared/type-aware",
            files: ["**/*.{ts,tsx}"],
            languageOptions: {
              parser: tsParser,
              parserOptions: {
                project: [tsconfigPath],
                tsconfigRootDir,
                ecmaVersion: 2022,
                sourceType: "module",
              },
            },
            plugins: {
              "@typescript-eslint": tsPlugin,
            },
            rules: TYPE_AWARE_RULES,
          },
        ]
      : [];

  return [baseConfig, ...typeAwareConfigs];
}

module.exports = { createBaseConfig };
