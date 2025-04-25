import { MistralApi } from './api';
import { getApiVersion, onApiKeyChange } from './config';
import { SQLDatabaseType } from './formatter/toSQL';
import { MistralModel, ChatCompletionOptions } from './types';

// Create a singleton instance of the API client
let apiInstance: MistralApi | null = null;

/**
 * Get the API client instance (creates one if it doesn't exist)
 */
export function getApi(): MistralApi {
  if (!apiInstance) {
    apiInstance = new MistralApi();
  }
  return apiInstance;
}

/**
 * Set the API key for the client
 * Used by config module
 */
export function setApiKey(apiKey: string): void {
  // Create a new instance with the updated API key and current API version
  apiInstance = new MistralApi(apiKey, getApiVersion());
}

// Register the setApiKey function with the config module
onApiKeyChange(setApiKey);

/**
 * Send a prompt to Mistral AI and get a text response
 * @param prompt - The text prompt
 * @param model - Mistral model to use
 * @param options - Additional options
 * @returns The generated text
 */
export async function sendPrompt(
  prompt: string,
  model: MistralModel = MistralModel.MEDIUM,
  options: Partial<ChatCompletionOptions> = {},
): Promise<string> {
  return getApi().generateText(prompt, model, options);
}

/**
 * Send a prompt to Mistral AI and get a JSON response with a class schema
 * @param prompt - The text prompt
 * @param schemaClass - Class constructor for the schema
 * @param model - Mistral model to use
 * @param options - Additional options
 * @returns The parsed JSON object
 */
export async function sendJsonPrompt<T extends Record<string, unknown>>(
  prompt: string,
  schemaClass: new () => T,
  model: MistralModel = MistralModel.MEDIUM,
  options: Partial<ChatCompletionOptions> = {},
): Promise<T> {
  const schemaObj = new schemaClass();
  return getApi().generateJson<T>(prompt, schemaObj as unknown as object, model, options);
}

/**
 * Send a prompt to Mistral AI and get a JSON response with an object schema
 * @param prompt - The text prompt
 * @param schema - Optional object schema
 * @param model - Mistral model to use
 * @param options - Additional options
 * @param typeDefinition - Optional TypeScript type definition as a string
 * @returns The parsed JSON object
 */
export async function sendJsonPromptWithSchema<T extends Record<string, unknown>>(
  prompt: string,
  schema?: object,
  model: MistralModel = MistralModel.MEDIUM,
  options: Partial<ChatCompletionOptions> = {},
  typeDefinition?: string,
): Promise<T> {
  return getApi().generateJson<T>(prompt, schema, model, options, typeDefinition);
}

/**
 * Send a prompt to Mistral AI and get an XML response
 * @param prompt - The text prompt
 * @param model - Mistral model to use
 * @param options - Additional options
 * @returns The XML string
 */
export async function sendXmlPrompt(
  prompt: string,
  model: MistralModel = MistralModel.MEDIUM,
  options: Partial<ChatCompletionOptions> = {},
): Promise<string> {
  return getApi().generateXml(prompt, model, options);
}

/**
 * Send a prompt to Mistral AI and get a Markdown response
 * @param prompt - The text prompt
 * @param model - Mistral model to use
 * @param options - Additional options
 * @returns The Markdown string
 */
export async function sendMarkdownPrompt(
  prompt: string,
  model: MistralModel = MistralModel.MEDIUM,
  options: Partial<ChatCompletionOptions> = {},
): Promise<string> {
  return getApi().generateMarkdown(prompt, model, options);
}

/**
 * Send a prompt to Mistral AI and get an SQL response
 * @param prompt - The text prompt
 * @param dbType - SQL database type
 * @param model - Mistral model to use
 * @param options - Additional options
 * @returns The SQL string
 */
export async function sendSqlPrompt(
  prompt: string,
  dbType: SQLDatabaseType = SQLDatabaseType.MYSQL,
  model: MistralModel = MistralModel.MEDIUM,
  options: Partial<ChatCompletionOptions> = {},
): Promise<string> {
  return getApi().generateSql(prompt, dbType, model, options);
}
