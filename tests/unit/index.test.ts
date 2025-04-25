import { describe, it, expect, jest } from '@jest/globals';

import MistralFormat, {
  init,
  toJson,
  toMarkdown,
  toXml,
  toSQL,
  SQLDatabaseType,
} from '../../src/index';

// Create correctly typed mocks
const mockClientModule = {
  setApiKey: jest.fn(),
  sendPrompt: jest.fn().mockResolvedValue('mocked response'),
  sendJsonPrompt: jest.fn(),
  sendJsonPromptWithSchema: jest.fn(),
  sendXmlPrompt: jest.fn(),
  sendMarkdownPrompt: jest.fn(),
  sendSqlPrompt: jest.fn(),
  getApi: jest.fn(),
};

const mockConfigModule = {
  setApiVersion: jest.fn(),
  getVersion: jest.fn().mockReturnValue('1.0.5'),
  getVersionInfo: jest.fn().mockReturnValue({ libraryVersion: '1.0.5', apiVersion: 'v1' }),
  onApiKeyChange: jest.fn(),
};

const mockJsonFormatter = {
  toJson: jest.fn().mockResolvedValue({ test: 'json' }),
};

const mockMarkdownFormatter = {
  toMarkdown: jest.fn().mockResolvedValue('# Markdown'),
};

const mockXmlFormatter = {
  toXml: jest.fn().mockResolvedValue('<root>XML</root>'),
};

const mockSqlFormatter = {
  toSQL: jest.fn().mockResolvedValue('SELECT * FROM test'),
  SQLDatabaseType: {
    MYSQL: 'MYSQL',
    POSTGRESQL: 'POSTGRESQL',
  },
};

// Mock the internal modules
jest.mock('../../src/client', () => mockClientModule);
jest.mock('../../src/config', () => mockConfigModule);
jest.mock('../../src/formatter/toJson', () => mockJsonFormatter);
jest.mock('../../src/formatter/toMarkdown', () => mockMarkdownFormatter);
jest.mock('../../src/formatter/toXml', () => mockXmlFormatter);
jest.mock('../../src/formatter/toSQL', () => mockSqlFormatter);

describe('Index Module (Default Export)', () => {
  describe('Default export', () => {
    it('should export all required functions and types', () => {
      // Testing that the default export contains all expected properties
      expect(MistralFormat).toBeDefined();
      expect(MistralFormat.init).toBeDefined();
      expect(MistralFormat.sendPrompt).toBeDefined();
      expect(MistralFormat.sendJsonPrompt).toBeDefined();
      expect(MistralFormat.sendJsonPromptWithSchema).toBeDefined();
      expect(MistralFormat.sendXmlPrompt).toBeDefined();
      expect(MistralFormat.sendMarkdownPrompt).toBeDefined();
      expect(MistralFormat.sendSqlPrompt).toBeDefined();
      expect(MistralFormat.getApi).toBeDefined();
      expect(MistralFormat.getVersion).toBeDefined();
      expect(MistralFormat.getVersionInfo).toBeDefined();
      expect(MistralFormat.onApiKeyChange).toBeDefined();
      expect(MistralFormat.toJson).toBeDefined();
      expect(MistralFormat.toMarkdown).toBeDefined();
      expect(MistralFormat.toXml).toBeDefined();
      expect(MistralFormat.toSQL).toBeDefined();
      expect(MistralFormat.SQLDatabaseType).toBeDefined();
      expect(MistralFormat.MistralError).toBeDefined();
      expect(MistralFormat.APIError).toBeDefined();
      expect(MistralFormat.ParseError).toBeDefined();
      expect(MistralFormat.AuthError).toBeDefined();
    });

    it('should use the named exports internally', async () => {
      // Test init function
      MistralFormat.init('test-key', 'v2');
      expect(mockClientModule.setApiKey).toHaveBeenCalledWith('test-key');
      expect(mockConfigModule.setApiVersion).toHaveBeenCalledWith('v2');
    });
  });

  describe('Named exports', () => {
    it('should export init function that calls the correct internal functions', () => {
      init('another-key', 'v1');
      expect(mockClientModule.setApiKey).toHaveBeenCalledWith('another-key');
      expect(mockConfigModule.setApiVersion).toHaveBeenCalledWith('v1');
    });

    it('should export formatter functions', async () => {
      // Just test that the exported functions match the imported ones
      const jsonResult = await toJson('json prompt');
      expect(jsonResult).toEqual({ test: 'json' });

      const markdownResult = await toMarkdown('markdown prompt');
      expect(markdownResult).toBe('# Markdown');

      const xmlResult = await toXml('xml prompt');
      expect(xmlResult).toBe('<root>XML</root>');

      const sqlResult = await toSQL('sql prompt');
      expect(sqlResult).toBe('SELECT * FROM test');

      // Check that the enum values are exported
      expect(SQLDatabaseType.MYSQL).toBe('MYSQL');
      expect(SQLDatabaseType.POSTGRESQL).toBe('POSTGRESQL');
    });
  });
});
