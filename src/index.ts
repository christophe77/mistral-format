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
import { onApiKeyChange, getVersion } from './config';
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

// Register the setApiKey function with config
onApiKeyChange(setApiKey);

// Export everything individually for ESM/CommonJS
export {
  // Main client
  sendPrompt,
  sendJsonPrompt,
  sendJsonPromptWithSchema,
  sendXmlPrompt,
  sendMarkdownPrompt,
  sendSqlPrompt,
  setApiKey,

  // API Client
  MistralApi,
  getApi,

  // Configuration
  getVersion,
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
