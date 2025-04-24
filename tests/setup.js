// Setup file for Jest tests

// Load environment variables from .env.test
require('dotenv').config({ path: '.env.test' });

// Set up process.env with testing values if not provided
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
// Don't set a default API key as it interferes with the tests

// Global mocks and settings
global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    choices: [{
      message: {
        content: 'Test response'
      }
    }]
  }),
  text: () => Promise.resolve('Test response')
}));

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
}); 