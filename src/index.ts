// External imports and client functionality
import { MistralApi } from './api';
import {
  sendPrompt,
  sendJsonPrompt,
  sendJsonPromptWithSchema,
  sendXmlPrompt,
  sendMarkdownPrompt,
  sendSqlPrompt,
  setApiKey,
  getApi,
} from './client';
import { onApiKeyChange, getVersion, setApiVersion, getVersionInfo } from './config';
import { MistralError, APIError, ParseError, AuthError } from './errors';
import { toJson, JsonOptions } from './formatter/toJson';
import { toMarkdown, MarkdownOptions } from './formatter/toMarkdown';
import { toSQL, SQLDatabaseType, SQLOptions } from './formatter/toSQL';
import { toXml, XmlOptions } from './formatter/toXml';
import {
  MistralModel,
  Message,
  MessageRole,
  ChatCompletionResponse,
  ChatCompletionOptions,
  ResponseFormat,
  ApiRequestOptions,
} from './types';

/**
 * Initialize the library with an API key and optional version
 * @param apiKey - The Mistral API key
 * @param version - Optional API version (default: 'v1')
 */
export function init(apiKey: string, version: string = 'v1'): void {
  setApiKey(apiKey);
  setApiVersion(version);
}

// Export everything individually for ESM/CommonJS
export {
  // Main client
  sendPrompt,
  sendJsonPrompt,
  sendJsonPromptWithSchema,
  sendXmlPrompt,
  sendMarkdownPrompt,
  sendSqlPrompt,

  // API Client
  MistralApi,
  getApi,

  // Configuration
  getVersion,
  getVersionInfo,
  onApiKeyChange,

  // Formatters
  toJson,
  JsonOptions,
  toMarkdown,
  MarkdownOptions,
  toXml,
  XmlOptions,
  toSQL,
  SQLOptions,
  SQLDatabaseType,

  // Error handling
  MistralError,
  APIError,
  ParseError,
  AuthError,

  // Types
  MistralModel,
  Message,
  MessageRole,
  ChatCompletionResponse,
  ChatCompletionOptions,
  ResponseFormat,
  ApiRequestOptions,
};

// Default export for CommonJS/UMD compatibility
interface MistralFormatExport {
  // Main functions
  init: typeof init;
  sendPrompt: typeof sendPrompt;
  sendJsonPrompt: typeof sendJsonPrompt;
  sendJsonPromptWithSchema: typeof sendJsonPromptWithSchema;
  sendXmlPrompt: typeof sendXmlPrompt;
  sendMarkdownPrompt: typeof sendMarkdownPrompt;
  sendSqlPrompt: typeof sendSqlPrompt;

  // API Client
  MistralApi: typeof MistralApi;
  getApi: typeof getApi;

  // Configuration
  getVersion: typeof getVersion;
  getVersionInfo: typeof getVersionInfo;
  onApiKeyChange: typeof onApiKeyChange;

  // Formatters
  toJson: typeof toJson;
  toMarkdown: typeof toMarkdown;
  toXml: typeof toXml;
  toSQL: typeof toSQL;
  SQLDatabaseType: typeof SQLDatabaseType;

  // Error handling
  MistralError: typeof MistralError;
  APIError: typeof APIError;
  ParseError: typeof ParseError;
  AuthError: typeof AuthError;
}

const MistralFormat: MistralFormatExport = {
  // Main functions
  init,
  sendPrompt,
  sendJsonPrompt,
  sendJsonPromptWithSchema,
  sendXmlPrompt,
  sendMarkdownPrompt,
  sendSqlPrompt,

  // API Client
  MistralApi,
  getApi,

  // Configuration
  getVersion,
  getVersionInfo,
  onApiKeyChange,

  // Formatters
  toJson,
  toMarkdown,
  toXml,
  toSQL,
  SQLDatabaseType,

  // Error handling
  MistralError,
  APIError,
  ParseError,
  AuthError,
};

export default MistralFormat;
