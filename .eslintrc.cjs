module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    quotes: ['error', 'double'],
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  },
  files: ['**/*.{ts,tsx}'],
  ignores: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser
  }
}
