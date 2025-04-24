// Import client functionality
import { 
  sendPrompt, 
  sendJsonPrompt,
  sendJsonPromptWithSchema,
  sendXmlPrompt,
  sendMarkdownPrompt,
  sendSqlPrompt,
  setApiKey,
  getApi
} from './client';

// Import configuration
import { init } from './config';

// Import formatters
import { toJson, JsonOptions } from './formatter/toJson';
import { toMarkdown, MarkdownOptions } from './formatter/toMarkdown';
import { toXml, XmlOptions } from './formatter/toXml';
import { toSQL, SQLDatabaseType, SQLOptions } from './formatter/toSQL';

// Import error handling
import { MistralError, APIError, ParseError, AuthError } from './errors';

// Import API client and types
import { MistralApi } from './api';
import { 
  MistralModel,
  Message,
  MessageRole,
  ChatCompletionResponse,
  ChatCompletionOptions,
  ResponseFormat,
  ApiRequestOptions
} from './types';

// Register the setApiKey function with config
import { _setApiKeyFunction } from './config';
_setApiKeyFunction(setApiKey);

// Define all exports for the UMD build - only include values, not types
const exports = {
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
  init,
  
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
  AuthError
};

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
  init,
  
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
  ApiRequestOptions
};

// Export default object for UMD build
export default exports;
