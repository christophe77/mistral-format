import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import { MistralApi } from '../../src/api';
import { APIError, AuthError } from '../../src/errors';
import * as rateLimiterModule from '../../src/rate-limiter';
import { ChatCompletionResponse } from '../../src/types';

// Mock rate limiter
jest.mock('../../src/rate-limiter', () => {
  return {
    ...jest.requireActual('../../src/rate-limiter'),
    getRateLimiter: jest.fn().mockReturnValue({
      execute: jest.fn().mockImplementation(fn => fn()),
    }),
  };
});

// Mock fetch globally with proper typing
global.fetch = jest.fn() as unknown as typeof fetch;
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('MistralApi', () => {
  let api: MistralApi;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Create a new instance with test API key
    api = new MistralApi('test-api-key', 'v1');
  });

  describe('constructor', () => {
    it('should create an instance with provided API key and version', () => {
      const testApi = new MistralApi('custom-key', 'v2');
      expect(testApi['apiKey']).toBe('custom-key');
      expect(testApi['chatCompletionsUrl']).toBe('https://api.mistral.ai/v2/chat/completions');
    });

    it('should use default values when not provided', () => {
      // Mock the config module's getApiKey function
      jest.mock('../../src/config', () => ({
        getApiKey: jest.fn().mockReturnValue('config-key'),
        getApiVersion: jest.fn().mockReturnValue('v1'),
      }));

      const defaultApi = new MistralApi();
      expect(defaultApi['apiBaseUrl']).toBe('https://api.mistral.ai');
      expect(defaultApi['chatCompletionsUrl']).toContain('/v1/chat/completions');
    });

    it('should set useRateLimiter flag based on constructor parameter', () => {
      const apiWithRateLimiter = new MistralApi('test-key', 'v1', true);
      expect(apiWithRateLimiter['useRateLimiter']).toBe(true);

      const apiWithoutRateLimiter = new MistralApi('test-key', 'v1', false);
      expect(apiWithoutRateLimiter['useRateLimiter']).toBe(false);
    });
  });

  describe('createChatCompletion', () => {
    it('should throw AuthError when API key is not set', async () => {
      const emptyApi = new MistralApi('');
      await expect(
        emptyApi.createChatCompletion({
          model: 'mistral-small',
          messages: [{ role: 'user', content: 'test' }],
        }),
      ).rejects.toThrow(AuthError);
    });

    it('should throw APIError on HTTP error response', async () => {
      // Mock fetch to return error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      } as Response);

      await expect(
        api.createChatCompletion({
          model: 'mistral-small',
          messages: [{ role: 'user', content: 'test' }],
        }),
      ).rejects.toThrow(APIError);
    });

    it('should throw APIError on empty choices', async () => {
      // Mock fetch to return success but empty choices
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [] }),
      } as Response);

      await expect(
        api.createChatCompletion({
          model: 'mistral-small',
          messages: [{ role: 'user', content: 'test' }],
        }),
      ).rejects.toThrow(APIError);
    });

    it('should use rate limiter when enabled', async () => {
      // Setup mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: 'success' } }],
        }),
      } as Response);

      const getRateLimiterSpy = jest.spyOn(rateLimiterModule, 'getRateLimiter');

      await api.createChatCompletion({
        model: 'mistral-small',
        messages: [{ role: 'user', content: 'test' }],
      });

      expect(getRateLimiterSpy).toHaveBeenCalled();
      expect(getRateLimiterSpy().execute).toHaveBeenCalled();
    });

    it('should not use rate limiter when disabled', async () => {
      // Setup API with rate limiter disabled
      const apiNoRateLimiter = new MistralApi('test-api-key', 'v1', false);

      // Setup mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: 'success' } }],
        }),
      } as Response);

      const getRateLimiterSpy = jest.spyOn(rateLimiterModule, 'getRateLimiter');

      await apiNoRateLimiter.createChatCompletion({
        model: 'mistral-small',
        messages: [{ role: 'user', content: 'test' }],
      });

      expect(getRateLimiterSpy).not.toHaveBeenCalled();
    });
  });

  describe('generateText', () => {
    it('should call createChatCompletion and return text content', async () => {
      // Mock the createChatCompletion method with proper typing
      const mockResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: 'generated text' } }],
        model: 'mistral-small',
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        object: 'chat.completion',
      };

      // Use any to bypass TypeScript checking for the test mock
      api.createChatCompletion = jest.fn().mockResolvedValueOnce(mockResponse) as any;

      const result = await api.generateText('test prompt', 'mistral-small');

      expect(result).toBe('generated text');
      expect(api.createChatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'mistral-small',
          messages: [{ role: 'user', content: 'test prompt' }],
        }),
      );
    });

    it('should handle empty response', async () => {
      // Mock response with no content
      const emptyResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: '' } }],
        model: 'mistral-medium',
        usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 },
        object: 'chat.completion',
      };

      api.createChatCompletion = jest.fn().mockResolvedValueOnce(emptyResponse) as any;

      const result = await api.generateText('test prompt');
      expect(result).toBe('');
    });
  });

  describe('generateJson', () => {
    it('should successfully parse a valid JSON response', async () => {
      // Mock the chat completion to return a valid JSON
      jest.spyOn(api, 'createChatCompletion').mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: '{"name":"John","age":30}',
            },
          },
        ],
      } as ChatCompletionResponse);

      const result = await api.generateJson('Generate a user');
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should extract JSON from a response with text wrapper', async () => {
      jest.spyOn(api, 'createChatCompletion').mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'Here is your JSON:\n```json\n{"name":"John","age":30}\n```',
            },
          },
        ],
      } as ChatCompletionResponse);

      const result = await api.generateJson('Generate a user');
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should use schema in the prompt when provided', async () => {
      const schema = { type: 'object', properties: { name: { type: 'string' } } };
      const createChatCompletionSpy = jest
        .spyOn(api, 'createChatCompletion')
        .mockResolvedValueOnce({
          choices: [
            {
              message: {
                content: '{"name":"John"}',
              },
            },
          ],
        } as ChatCompletionResponse);

      await api.generateJson('Generate a user', schema);

      // Check that the schema was included in the prompt
      expect(createChatCompletionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining(JSON.stringify(schema)),
            }),
          ]),
        }),
      );
    });

    it('should use typeDefinition in the prompt when provided', async () => {
      const typeDefinition = 'interface User { name: string; }';
      const createChatCompletionSpy = jest
        .spyOn(api, 'createChatCompletion')
        .mockResolvedValueOnce({
          choices: [
            {
              message: {
                content: '{"name":"John"}',
              },
            },
          ],
        } as ChatCompletionResponse);

      await api.generateJson('Generate a user', undefined, 'mistral-small', {}, typeDefinition);

      // Check that the type definition was included in the prompt
      expect(createChatCompletionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining(typeDefinition),
            }),
          ]),
        }),
      );
    });
  });

  describe('generateXml', () => {
    it('should return XML content', async () => {
      const mockXml = '<root><item>test</item></root>';
      const mockResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: mockXml } }],
        model: 'mistral-medium',
        usage: { prompt_tokens: 10, completion_tokens: 8, total_tokens: 18 },
        object: 'chat.completion',
      };

      api.createChatCompletion = jest.fn().mockResolvedValueOnce(mockResponse) as any;

      const result = await api.generateXml('test prompt');
      expect(result).toBe(mockXml);
    });
  });

  describe('generateMarkdown', () => {
    it('should return Markdown content', async () => {
      const mockMarkdown = '# Heading\n\nText';
      const mockResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: mockMarkdown } }],
        model: 'mistral-medium',
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        object: 'chat.completion',
      };

      api.createChatCompletion = jest.fn().mockResolvedValueOnce(mockResponse) as any;

      const result = await api.generateMarkdown('test prompt');
      expect(result).toBe(mockMarkdown);
    });
  });

  describe('generateSql', () => {
    it('should return SQL query with dialect', async () => {
      const mockSql = 'SELECT * FROM users';
      const mockResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: mockSql } }],
        model: 'mistral-medium',
        usage: { prompt_tokens: 15, completion_tokens: 5, total_tokens: 20 },
        object: 'chat.completion',
      };

      api.createChatCompletion = jest.fn().mockResolvedValueOnce(mockResponse) as any;

      const result = await api.generateSql('test prompt', 'PostgreSQL');
      expect(result).toBe(mockSql);
      expect(api.createChatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            {
              role: 'user',
              content: expect.stringContaining('PostgreSQL'),
            },
          ],
        }),
      );
    });
  });
});
