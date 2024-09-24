import globals from 'globals';
import eslint from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const flatCompat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

/**
 * @see https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
 * @param {string} name the plugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
function legacyPlugin(name, alias = name) {
  const plugin = flatCompat.plugins(name)[0]?.plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  return fixupPluginRules(plugin);
}

export default [
  ...fixupConfigRules(flatCompat.extends('airbnb-base')),
  eslintPluginPrettierRecommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.es2024,
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      import: legacyPlugin('eslint-plugin-import', 'import'),
    },
    rules: {
      'no-restricted-globals': 'off',
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
];
