module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
    'global-require': 0,
    'no-underscore-dangle': 0,
  },
  overrides: [
    // Set Jest rules only for test files.
    // https://stackoverflow.com/a/49211283
    {
      files: ['**/*.test.js', '**/__mocks__/**/*.js'],
      extends: ['plugin:jest/recommended'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      rules: {
        'global-require': 0,
        'react/jsx-props-no-spreading': 0,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      alias: [['src', './src']],
    },
    react: {
      version: 'latest',
    },
  },
}
