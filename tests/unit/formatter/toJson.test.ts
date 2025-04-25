import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import * as clientModule from '../../../src/client';
import { toJson } from '../../../src/formatter/toJson';

// Create simplified mocks
const mockSendJsonPrompt = jest.fn();
const mockSendJsonPromptWithSchema = jest.fn();

// Mock the client module
jest.mock('../../../src/client', () => ({
  sendJsonPrompt: jest.fn().mockImplementation((...args) => mockSendJsonPrompt(...args)),
  sendJsonPromptWithSchema: jest
    .fn()
    .mockImplementation((...args) => mockSendJsonPromptWithSchema(...args)),
}));

describe('toJson Formatter', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockSendJsonPrompt.mockReset();
    mockSendJsonPromptWithSchema.mockReset();
  });

  it('should generate JSON with default options', async () => {
    // Setup mock
    mockSendJsonPromptWithSchema.mockResolvedValueOnce({ name: 'test' });

    // Call the function
    const result = await toJson('Generate user data');

    // Verify result
    expect(result).toEqual({ name: 'test' });
    expect(mockSendJsonPromptWithSchema).toHaveBeenCalledWith(
      'Generate user data',
      undefined,
      undefined,
      expect.anything(), // Allow any value here for flexibility
      undefined,
    );
  });

  it('should generate JSON with type schema', async () => {
    // Setup test class
    class UserSchema {
      name: string = '';
      age: number = 0;
      [key: string]: unknown; // Index signature to make it compatible with Record<string, unknown>
    }

    // Setup mock
    mockSendJsonPrompt.mockResolvedValueOnce({ name: 'John', age: 30 });

    // Call the function with the schema
    const result = await toJson('Generate user data', {
      typeSchema: UserSchema,
      model: 'mistral-small',
      options: { temperature: 0.3 },
    });

    // Verify result
    expect(result).toEqual({ name: 'John', age: 30 });
    expect(mockSendJsonPrompt).toHaveBeenCalledWith(
      'Generate user data',
      UserSchema,
      'mistral-small',
      { temperature: 0.3 },
    );
  });

  it('should generate JSON with JSON schema', async () => {
    // Setup schema
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
      },
    };

    // Setup mock
    mockSendJsonPromptWithSchema.mockResolvedValueOnce({
      name: 'John',
      email: 'john@example.com',
    });

    // Call the function with the schema
    const result = await toJson('Generate user data', {
      schema,
      model: 'mistral-medium',
    });

    // Verify result
    expect(result).toEqual({ name: 'John', email: 'john@example.com' });
    expect(mockSendJsonPromptWithSchema).toHaveBeenCalledWith(
      'Generate user data',
      schema,
      'mistral-medium',
      expect.anything(), // Allow any value here for flexibility
      undefined,
    );
  });

  it('should generate JSON with type definition', async () => {
    // Setup type definition
    const typeDefinition = `
      interface User {
        name: string;
        active: boolean;
      }
    `;

    // Setup mock
    mockSendJsonPromptWithSchema.mockResolvedValueOnce({
      name: 'John',
      active: true,
    });

    // Call the function with the type definition
    const result = await toJson('Generate user data', {
      typeDefinition,
      model: 'mistral-large',
      options: { max_tokens: 1000 },
    });

    // Verify result
    expect(result).toEqual({ name: 'John', active: true });
    expect(mockSendJsonPromptWithSchema).toHaveBeenCalledWith(
      'Generate user data',
      undefined,
      'mistral-large',
      { max_tokens: 1000 },
      typeDefinition,
    );
  });

  it('should handle errors gracefully', async () => {
    // Setup mock to throw an error
    const apiError = new Error('API error');
    mockSendJsonPromptWithSchema.mockRejectedValueOnce(apiError);

    // Expect the function to throw an error
    await expect(toJson('Generate user data')).rejects.toThrow();
  });
});
