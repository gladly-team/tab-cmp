module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  rules: {
    'global-require': 0,
  },
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
