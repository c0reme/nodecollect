import { Config } from 'jest';

const config: Config = {
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: true }] },
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: { '^(\\.\\.?\\/.+)\\.js$': '$1' },
  collectCoverage: true
};

export default config;
