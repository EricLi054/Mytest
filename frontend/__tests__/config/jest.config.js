const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  rootDir: '../../',
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/e2e/", 
    "<rootDir>/__tests__/config/", 
    "<rootDir>/__tests__/mockData/", 
    "<rootDir>/__tests__/helpers/", 
    "<rootDir>/node_modules/"
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/.storybook/**',
    '!**/__stories__/**',
    '!**/*.d.ts',
    '!**/.next/**',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/__tests__/config/**',
    '!**/__tests__/e2e/**',
    '!**/__tests__/mockData/**',
    '!**/__tests__/helpers/**'
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  }
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
