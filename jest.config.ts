import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testMatch: ['<rootDir>src/tests/instructor.test.ts'],
};

export default config;

//module.exports = {
//    preset: 'ts-jest',
//    testEnvironment: 'node',
//    verbose: true,
//    colect
//  };
