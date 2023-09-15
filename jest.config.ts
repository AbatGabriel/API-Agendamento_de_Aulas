import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/controllers/**.ts',
    '<rootDir>/src/middleware/**.ts'
  ],
  testMatch: ['<rootDir>src/tests/auth.test.ts'],
};

export default config;
