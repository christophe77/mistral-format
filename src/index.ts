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
import { toMarkdown } from './formatter/toMarkdown';
import { toXml } from './formatter/toXml';
import { toSQL, SQLDatabaseType } from './formatter/toSQL';

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

// Export everything
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
  toXml,
  toSQL,
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
