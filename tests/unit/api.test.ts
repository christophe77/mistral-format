import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import { MistralApi } from '../../src/api';
import { APIError, AuthError } from '../../src/errors';
import { ChatCompletionResponse } from '../../src/types';

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

    it('should return valid response on success', async () => {
      const mockResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: 'test response' } }],
      };

      // Mock fetch to return success with valid response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await api.createChatCompletion({
        model: 'mistral-small',
        messages: [{ role: 'user', content: 'test' }],
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/chat/completions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        }),
      );
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
    it('should parse JSON response correctly', async () => {
      const mockJsonContent = '{"name":"test","value":123}';
      const mockResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: mockJsonContent } }],
        model: 'mistral-medium',
        usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
        object: 'chat.completion',
      };

      api.createChatCompletion = jest.fn().mockResolvedValueOnce(mockResponse) as any;

      const result = await api.generateJson<{ name: string; value: number }>('test prompt');
      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should extract JSON from markdown code blocks', async () => {
      const mockResponse: ChatCompletionResponse = {
        id: 'test-id',
        choices: [{ message: { role: 'assistant', content: '```json\n{"name":"test"}\n```' } }],
        model: 'mistral-medium',
        usage: { prompt_tokens: 10, completion_tokens: 15, total_tokens: 25 },
        object: 'chat.completion',
      };

      api.createChatCompletion = jest.fn().mockResolvedValueOnce(mockResponse) as any;

      const result = await api.generateJson('test prompt');
      expect(result).toEqual({ name: 'test' });
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
