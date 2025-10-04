import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
      "react/jsx-key": "warn", // Ensure 'key' is used in lists
      "react/no-unknown-property": "warn", // Prevent mistyped HTML attributes
      "react/prop-types": "off",
      "indent": ["warn", 2, { "SwitchCase": 1, "ignoredNodes": ["JSXElement *"] }], // Enforce 2-space indentation
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: "^_" }],
      'no-case-declarations': 'off',
      'no-extra-boolean-cast': 'off',
    },
  },
];
