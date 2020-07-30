module.exports = {
  collectCoverageFrom: [
    'src/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
    '!src/qcCmpModified.js',
  ],
  coverageDirectory: './coverage/',
  setupFilesAfterEnv: ['<rootDir>/src/jestSetup.js'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/.yalc/',
    '/.git/',
    '/quantcast/',
    '/src/qcCmpModified.js',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '/.yalc/',
    '^.+\\.module\\.(css|sass|scss)$',
    '/quantcast/',
    '/src/qcCmpModified.js',
  ],
}
