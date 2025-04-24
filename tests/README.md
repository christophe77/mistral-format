# Testing Strategy

This folder contains the tests for the Mistral AI client library.

## Test Structure

The tests are organized by functionality:

- `unit/`: Unit tests for individual components
  - `config.test.ts`: Tests for configuration management
  - `api.test.ts`: Tests for the API client
  - `formatters/`: Tests for formatters
    - `toJson.test.ts`: Tests for JSON formatter
    - `toMarkdown.test.ts`: Tests for Markdown formatter
    - `toXml.test.ts`: Tests for XML formatter
    - `toSql.test.ts`: Tests for SQL formatter
- `integration/`: Integration tests that test multiple components together
- `e2e/`: End-to-end tests with the actual API (requires API key)

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run e2e tests only (requires API key)
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Test Setup

The tests use the following libraries:

- Jest: Test runner and assertion library
- ts-jest: TypeScript support for Jest
- nock: HTTP mocking library for unit and integration tests

## Mocking Strategy

- Unit tests should mock external dependencies
- Integration tests may use real dependencies but should mock the API
- E2E tests use real dependencies and real API calls

## Test Conventions

1. Each test file should correspond to a source file
2. Test files should follow the same directory structure as source files
3. Test filenames should match source filenames with `.test.ts` suffix
4. Test cases should be descriptive and follow the pattern: `it('should do something when something happens', ...)`
5. Use `describe` blocks to group related tests
6. Use `beforeEach` and `afterEach` for test setup and teardown
7. Use `beforeAll` and `afterAll` for one-time setup and teardown

## Environment Variables

Create a `.env.test` file for testing with the following variables:

```
MISTRAL_API_KEY=your_test_api_key
```

For CI/CD environments, set these variables in your pipeline.
