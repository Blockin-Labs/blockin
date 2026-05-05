/** Minimal jest config for the SIWE conformance tests. UI / native deps
 * stay out of the test runtime — tests target the construction +
 * parsing pure functions in `src/verify.ts` only. */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  // Exclude the UI tree — those modules drag in React + bundler globals
  // that would require additional config to type-check.
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/ui/'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true, diagnostics: false }]
  }
};
