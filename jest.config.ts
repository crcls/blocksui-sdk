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
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules/(?!(ts-invariant)/)', 'dist'],
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  transform: {
    '\\.[jt]sx?$': ['ts-jest', { useESM: true }],
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
}
