import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/config-helpers';
import js from '@eslint/js';
import { configs, plugins, rules } from 'eslint-config-airbnb-extended';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const projectRoot = path.resolve(dirname);
export const gitignorePath = path.resolve(projectRoot, '.gitignore');

export default defineConfig([
  globalIgnores(['dist/**']),
  includeIgnoreFile(gitignorePath),
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,

  plugins.typescriptEslint,
  ...configs.base.typescript,
  rules.typescript.typescriptEslintStrict,

  eslintPluginPrettierRecommended,

  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2024,
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['./tsconfig.json'],
        }),
      ],
    },
    rules: {
      'class-methods-use-this': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-syntax': 'off',
      'no-promise-executor-return': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state', 'acc'],
        },
      ],
      'spaced-comment': [
        'error',
        'always',
        {
          markers: ['/', '==UserScript==', '==/UserScript=='],
        },
      ],

      'import-x/order': 'off',
      'import-x/extensions': 'off',
      'import-x/no-unresolved': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/prefer-default-export': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
    },
  },

  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: plugins.typescriptEslint.files,
    rules: {
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unnecessary-type-arguments': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/method-signature-style': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
        },
      ],
    },
  },

  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-named-exports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: ['type-export', 'value-export', 'unknown'],
        },
      ],
      'perfectionist/sort-named-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: ['type-import', 'value-import', 'unknown'],
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 0,
          fallbackSort: {
            type: 'type-import-first',
            order: 'asc',
          },
          tsconfig: {
            rootDir: '.',
            filename: 'tsconfig.json',
          },
          groups: [
            // Builtins
            'builtin',
            { newlinesBetween: 1 },
            // Externals
            'external',
            { newlinesBetween: 1 },
            // Internals
            'tsconfig-path',
            'subpath',
            'internal',
            'index',
            'sibling',
            'parent',
            { newlinesBetween: 1 },
            // Styles
            'side-effect-style',
            'style',
            { newlinesBetween: 1 },
            // Unknown
            'unknown',
          ],
        },
      ],
    },
  },
]);
