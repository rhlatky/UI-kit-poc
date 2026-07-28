import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import oxlint from 'eslint-plugin-oxlint'

// ESLint lints ONLY .vue files — oxlint handles .ts/.mjs natively and faster.
export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.d.ts',
      '**/*.ts',
      '**/*.mjs',
      '**/*.js',
    ],
  },

  js.configs.recommended,
  ...vue.configs['flat/essential'],

  {
    files: ['**/*.vue'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
    },
  },

  // Must stay last: turns off every ESLint rule already handled by oxlint.
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
)
