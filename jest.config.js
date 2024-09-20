/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(^(?!.*integration).*)(test.ts)',
  roots: ['<rootDir>/src'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/migrations/',
    'ormconfig-cli.ts',
    '.*/tests/(.*/)*.+.ts$',
    '/.*.integration.test.ts$/',
  ],
}
