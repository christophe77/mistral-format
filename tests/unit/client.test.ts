import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import { MistralApi } from '../../src/api';
import {
  getApi,
  setApiKey,
  sendPrompt,
  sendJsonPrompt,
  sendJsonPromptWithSchema,
  sendXmlPrompt,
  sendMarkdownPrompt,
  sendSqlPrompt,
} from '../../src/client';
import { SQLDatabaseType } from '../../src/formatter/toSQL';

// Create a properly typed mock
type MockMistralApi = {
  generateText: jest.Mock;
  generateJson: jest.Mock;
  generateXml: jest.Mock;
  generateMarkdown: jest.Mock;
  generateSql: jest.Mock;
};

// Mock the MistralApi class
jest.mock('../../src/api', () => {
  const mockApi: MockMistralApi = {
    generateText: jest.fn().mockResolvedValue('mock text response'),
    generateJson: jest.fn().mockResolvedValue({ data: 'mock json' }),
    generateXml: jest.fn().mockResolvedValue('<root>mock xml</root>'),
    generateMarkdown: jest.fn().mockResolvedValue('# Mock Markdown'),
    generateSql: jest.fn().mockResolvedValue('SELECT * FROM users'),
  };

  return {
    MistralApi: jest.fn().mockImplementation(() => mockApi),
  };
});

describe('Client Module', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getApi', () => {
    it('should create and return an API instance', () => {
      const api = getApi();
      expect(api).toBeDefined();
      expect(MistralApi).toHaveBeenCalled();
    });

    it('should return the same instance on subsequent calls', () => {
      const firstCall = getApi();
      const secondCall = getApi();
      expect(firstCall).toBe(secondCall);
      expect(MistralApi).toHaveBeenCalledTimes(1);
    });
  });

  describe('setApiKey', () => {
    it('should create a new API instance with the provided key', () => {
      setApiKey('new-api-key');
      expect(MistralApi).toHaveBeenCalledWith('new-api-key', expect.any(String));
    });
  });

  describe('sendPrompt', () => {
    it('should call generateText on the API instance', async () => {
      const result = await sendPrompt('test prompt', 'mistral-small', { temperature: 0.5 });
      expect(result).toBe('mock text response');

      const apiInstance = getApi() as unknown as MockMistralApi;
      expect(apiInstance.generateText).toHaveBeenCalledWith('test prompt', 'mistral-small', {
        temperature: 0.5,
      });
    });
  });

  describe('sendJsonPrompt', () => {
    it('should call generateJson with schema class', async () => {
      class TestSchema {
        name: string = '';
        value: number = 0;
      }

      const result = await sendJsonPrompt('test json prompt', TestSchema);
      expect(result).toEqual({ data: 'mock json' });

      const apiInstance = getApi() as unknown as MockMistralApi;
      expect(apiInstance.generateJson).toHaveBeenCalledWith(
        'test json prompt',
        expect.any(Object),
        'mistral-medium',
        {},
      );
    });
  });

  describe('sendJsonPromptWithSchema', () => {
    it('should call generateJson with schema object', async () => {
      const schema = {
        type: 'object',
        properties: { name: { type: 'string' } },
      };

      const result = await sendJsonPromptWithSchema(
        'test schema prompt',
        schema,
        'mistral-small',
        { temperature: 0.3 },
        'interface Test { name: string }',
      );

      expect(result).toEqual({ data: 'mock json' });

      const apiInstance = getApi() as unknown as MockMistralApi;
      expect(apiInstance.generateJson).toHaveBeenCalledWith(
        'test schema prompt',
        schema,
        'mistral-small',
        { temperature: 0.3 },
        'interface Test { name: string }',
      );
    });
  });

  describe('sendXmlPrompt', () => {
    it('should call generateXml on the API instance', async () => {
      const result = await sendXmlPrompt('test xml prompt');
      expect(result).toBe('<root>mock xml</root>');

      const apiInstance = getApi() as unknown as MockMistralApi;
      expect(apiInstance.generateXml).toHaveBeenCalledWith('test xml prompt', 'mistral-medium', {});
    });
  });

  describe('sendMarkdownPrompt', () => {
    it('should call generateMarkdown on the API instance', async () => {
      const result = await sendMarkdownPrompt('test markdown prompt', 'mistral-large');
      expect(result).toBe('# Mock Markdown');

      const apiInstance = getApi() as unknown as MockMistralApi;
      expect(apiInstance.generateMarkdown).toHaveBeenCalledWith(
        'test markdown prompt',
        'mistral-large',
        {},
      );
    });
  });

  describe('sendSqlPrompt', () => {
    it('should call generateSql on the API instance', async () => {
      const result = await sendSqlPrompt('test sql prompt', SQLDatabaseType.POSTGRESQL);
      expect(result).toBe('SELECT * FROM users');

      const apiInstance = getApi() as unknown as MockMistralApi;
      expect(apiInstance.generateSql).toHaveBeenCalledWith(
        'test sql prompt',
        SQLDatabaseType.POSTGRESQL,
        'mistral-medium',
        {},
      );
    });
  });
});
