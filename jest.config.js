module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js}',
    '!**/__mocks__/**',
    '!**/node_modules/**',
    '!src/qcCmpModified.js',
  ],
  coverageDirectory: './coverage/',
  // modulePaths: ['<rootDir>/'],
  setupFilesAfterEnv: ['<rootDir>/src/jestSetup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/.yalc/',
    '/.git/',
    '/quantcast/',
  ],
  // transformIgnorePatterns: [
  //   '/node_modules/',
  //   '/.yalc/',
  //   '^.+\\.module\\.(css|sass|scss)$',
  //   '/quantcast/',
  //   '/src/qcCmpModified.js',
  // ],
}
