/**
 * @description Config codingRules
 * A simple eslint file based on airbnb rules
 * Find all rules here https://eslint.org/docs/rules/
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json',
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Add new rules here
    'no-console': 'off', // back can use console
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off',
  },
};
