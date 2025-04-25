/**
 * Mistral API Types
 */

// Models supported by Mistral AI
// Source: https://docs.mistral.ai/getting-started/models/models_overview/
export enum MistralModel {
  TINY = 'mistral-tiny',
  SMALL = 'mistral-small',
  MEDIUM = 'mistral-medium',
  LARGE = 'mistral-large',
}

// Role of a message in a conversation
export type MessageRole = 'user' | 'assistant' | 'system';

// Message structure
export interface Message {
  role: MessageRole;
  content: string;
}

// Represents a chat choice in the response
export interface ChatChoice {
  index: number;
  message: Message;
  finish_reason: 'stop' | 'length' | null;
}

// Represents a chat completion response
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Supported formats for responses
export enum ResponseFormat {
  TEXT = 'text',
  JSON_OBJECT = 'json_object',
  JSON_SCHEMA = 'json_schema',
}

// Base options for API requests
export interface ApiRequestOptions {
  model: MistralModel;
  messages: Message[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  safe_mode?: boolean;
  random_seed?: number;
}

// Options for chat completion
export interface ChatCompletionOptions extends ApiRequestOptions {
  response_format?: {
    type: ResponseFormat;
    // Additional format-specific configuration, if needed
    syntax?: string; // For SQL, can specify the database type
  };
}

// Options for JSON-specific responses
export interface JsonResponseOptions {
  schema?: object;
  strict?: boolean;
}

// Options for SQL-specific responses
export interface SqlResponseOptions {
  dialect?: string;
  strict?: boolean;
}

// Options for XML-specific responses
export interface XmlResponseOptions {
  strict?: boolean;
}

// Options for Markdown-specific responses
export interface MarkdownResponseOptions {
  strict?: boolean;
}
