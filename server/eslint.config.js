const path = require('node:path');
const { defineConfig } = require('eslint/config');
const { createBaseConfig } = require('../eslint.base');

module.exports = defineConfig([
  ...createBaseConfig({
    tsconfigPath: path.join(__dirname, 'tsconfig.json'),
    reactNative: false
  }),
  {
    name: 'server/overrides',
    ignores: ['dist/**', 'prisma/**']
  }
]);




