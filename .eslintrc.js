module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ['airbnb', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
  settings: {
    'import/resolver': { typescript: {} },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': [2, {}, { usePrettierrc: true }],
    'arrow-body-style': [2, 'as-needed'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.js', '**/*.spec.js', '**/*.test.jsx', '**/*.spec.jsx'],
      },
    ],
  },
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
        'plugin:prettier/recommended', // Prettier plugin
      ],
      rules: {
        'prettier/prettier': [2, {}, { usePrettierrc: true }],
        'arrow-body-style': [2, 'as-needed'],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // We will use TypeScript's types for component props instead
        'react/prop-types': 'off',

        // Why would you want unused vars?
        '@typescript-eslint/no-unused-vars': ['error'],

        'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],

        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],

        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],

        'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],

        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.test.ts',
              '**/*.spec.ts',
              '**/*.test.tsx',
              '**/*.spec.tsx',
              '**/*setupTests.ts',
            ],
          },
        ],

        'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],

        // I suggest this setting for requiring return types on functions only where useful
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
      },
    },
  ],
};
