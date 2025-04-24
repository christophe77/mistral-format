import { 
  ChatCompletionOptions, 
  ChatCompletionResponse, 
  MistralModel 
} from '../types';

/**
 * Interface for Mistral API Client
 * Follows the Interface Segregation Principle
 */
export interface IApiClient {
  /**
   * Create a chat completion
   * @param options - Chat completion options
   * @returns Chat completion response
   */
  createChatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse>;
  
  /**
   * Generate a text completion from a prompt
   * @param prompt - The text prompt
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The generated text
   */
  generateText(
    prompt: string, 
    model?: MistralModel,
    options?: Partial<ChatCompletionOptions>
  ): Promise<string>;
  
  /**
   * Generate a JSON response from a prompt
   * @param prompt - The text prompt
   * @param schema - Optional JSON schema object
   * @param model - Mistral model to use
   * @param options - Additional options
   * @param typeDefinition - Optional TypeScript type definition as a string
   * @returns The parsed JSON object
   */
  generateJson<T = any>(
    prompt: string,
    schema?: object,
    model?: MistralModel,
    options?: Partial<ChatCompletionOptions>,
    typeDefinition?: string
  ): Promise<T>;
  
  /**
   * Generate an XML response from a prompt
   * @param prompt - The text prompt
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The XML string
   */
  generateXml(
    prompt: string,
    model?: MistralModel,
    options?: Partial<ChatCompletionOptions>
  ): Promise<string>;
  
  /**
   * Generate a Markdown response from a prompt
   * @param prompt - The text prompt
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The Markdown string
   */
  generateMarkdown(
    prompt: string,
    model?: MistralModel,
    options?: Partial<ChatCompletionOptions>
  ): Promise<string>;
  
  /**
   * Generate an SQL response from a prompt
   * @param prompt - The text prompt
   * @param dialect - SQL dialect (e.g., "MySQL", "PostgreSQL")
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The SQL string
   */
  generateSql(
    prompt: string,
    dialect?: string,
    model?: MistralModel,
    options?: Partial<ChatCompletionOptions>
  ): Promise<string>;
} 