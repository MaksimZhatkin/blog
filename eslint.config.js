// @ts-check

import path from 'path';
import { fileURLToPath } from 'url';

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import pluginJs from '@eslint/js';
import pluginReactQuery from '@tanstack/eslint-plugin-query';
import globals from 'globals';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// @ts-ignore
import pluginReact from 'eslint-plugin-react';
// @ts-ignore
import pluginReactHooks from 'eslint-plugin-react-hooks';
// @ts-ignore
import ConfigPrettier from 'eslint-config-prettier';
// @ts-ignore
import pluginReactJSXa11y from 'eslint-plugin-jsx-a11y';
// @ts-ignore
import { FlatCompat } from '@eslint/eslintrc';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* eslint-enable no-underscore-dangle */

// @ts-ignore
const compat = new FlatCompat({
  baseDirectory: __dirname, // optional; default: process.cwd()
  resolvePluginsRelativeTo: __dirname, // optional
});

export default [
  // Ignores
  {
    ignores: ['dist/**', 'node_modules/**', 'bin/**', 'public/**', 'build/**'],
  },

  // Base configuration
  {
    languageOptions: {
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        RequestInit: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      reactQuery: pluginReactQuery,
      prettier: pluginPrettier,
      react: pluginReact,
      reactHooks: pluginReactHooks,
      reactA11y: pluginReactJSXa11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Airbnb shared config
  ...compat.extends('airbnb'),

  // JavaScript specific rules
  pluginJs.configs.recommended,
  pluginPrettierRecommended,
  ConfigPrettier,

  // TypeScript specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  {
    rules: {
      'prettier/prettier': 'error',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-amd': 'off',
      'import/newline-after-import': 'off',
      'import/no-mutable-exports': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': [2, { caseSensitive: false }],
      'import/extensions': 'off',
      'import/order': [
        2,
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  // Target files
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx', 'tsx'] }],
      // Add specific rules

      'react/button-has-type': 0,
      'react/require-default-props': [
        1,
        {
          functions: 'defaultArguments',
        },
      ],
    },
  },
];
