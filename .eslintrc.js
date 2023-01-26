module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: [
    '/db/data/migrations/*.js',
    '/db/data/seeds/*.js',
    '/node_modules/*',
    'README.md',
    '/docs',
    '/test',
    'package-lock.json',
    'package.json',
  ],
  rules: {
    'consistent-return': 'off',
    'object-curly-newline': ['error', { consistent: true }],
    'arrow-parens': 'off',
    'comma-dangle': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': ['error', { allow: ['error'] }],
  },
};
