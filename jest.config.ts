/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: "coverage",
  // coverageProvider: "v8",
  // automock: true,
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {},
  transformIgnorePatterns: ['node_modules/(?!(ts-invariant)/)', 'dist'],
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
}
