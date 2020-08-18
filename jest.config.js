module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/__mocks__/**',
    '!**/node_modules/**',
    '!src/qcCmpModified.js',
  ],
  coverageDirectory: './coverage/',
  modulePaths: ['<rootDir>/'],
  setupFilesAfterEnv: ['<rootDir>/src/jestSetup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/.git/',
    '<rootDir>/quantcast/',
    '<rootDir>/.yalc/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/.git/',
    '<rootDir>/quantcast/',
    '<rootDir>/.yalc/',
  ],
}
