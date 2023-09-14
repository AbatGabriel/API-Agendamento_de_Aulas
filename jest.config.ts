import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/controllers/*.ts'],
  testMatch: ['<rootDir>src/tests/*.test.ts'],
};

export default config;

