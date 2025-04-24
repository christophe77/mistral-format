import { getApiKey, getVersion } from './config';
import { APIError, AuthError, safeExecute } from './errors';
import { IApiClient } from './interfaces/IApiClient';
import { ChatCompletionOptions, ChatCompletionResponse, MistralModel } from './types';

/**
 * Build the API base URL with the configured version
 * @param apiVersion - API version
 * @returns The base API URL
 */
function buildApiBaseUrl(apiVersion: string): string {
  return `https://api.mistral.ai/${apiVersion}`;
}

/**
 * Mistral API Client
 * Implements the IApiClient interface
 */
export class MistralApi implements IApiClient {
  private readonly apiKey: string;
  private readonly apiBaseUrl: string;
  private readonly chatCompletionsUrl: string;

  /**
   * Creates a new Mistral API client instance
   * @param apiKey - Optional API key (will use config if not provided)
   * @param apiVersion - Optional API version (will use config if not provided)
   */
  constructor(apiKey?: string, apiVersion?: string) {
    const configApiKey = getApiKey();
    this.apiKey = apiKey ?? (configApiKey || '');
    const version = apiVersion ?? getVersion();
    this.apiBaseUrl = buildApiBaseUrl(version);
    this.chatCompletionsUrl = `${this.apiBaseUrl}/chat/completions`;
  }

  /**
   * Create a chat completion
   * @param options - Chat completion options
   * @returns Chat completion response
   */
  async createChatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    return safeExecute(async () => {
      if (!this.apiKey) {
        throw new AuthError();
      }

      const res = await fetch(this.chatCompletionsUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!res.ok) {
        throw new APIError(
          `API request failed with status ${res.status}`,
          res.status,
          await res.text(),
        );
      }

      const json = (await res.json()) as ChatCompletionResponse;

      if (!json.choices.length) {
        throw new APIError('Invalid API response: missing choices', res.status, json);
      }

      return json;
    }, 'Failed to get response from Mistral AI API');
  }

  /**
   * Generate a text completion from a prompt
   * @param prompt - The text prompt
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The generated text
   */
  async generateText(
    prompt: string,
    model: MistralModel = 'mistral-medium',
    options: Partial<ChatCompletionOptions> = {},
  ): Promise<string> {
    const response = await this.createChatCompletion({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature ?? 0.7,
      top_p: options.top_p,
      max_tokens: options.max_tokens,
      ...options,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  }

  /**
   * Generate a JSON response from a prompt
   * @param prompt - The text prompt
   * @param schema - Optional JSON schema object
   * @param model - Mistral model to use
   * @param options - Additional options
   * @param typeDefinition - Optional TypeScript type definition as a string
   * @returns The parsed JSON object
   */
  async generateJson<T extends Record<string, unknown>>(
    prompt: string,
    schema?: object,
    model: MistralModel = 'mistral-medium',
    options: Partial<ChatCompletionOptions> = {},
    typeDefinition?: string,
  ): Promise<T> {
    let fullPrompt: string;

    if (typeDefinition) {
      fullPrompt = `${prompt}\n\nPlease respond with a properly formatted JSON object that matches this TypeScript type:\n\`\`\`typescript\n${typeDefinition}\n\`\`\``;
    } else if (schema) {
      fullPrompt = `${prompt}\n\nPlease respond with a properly formatted JSON object that follows this schema: ${JSON.stringify(
        schema,
      )}`;
    } else {
      fullPrompt = `${prompt}\n\nPlease respond with a valid, well-formatted JSON object only.`;
    }

    const response = await this.createChatCompletion({
      model,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: options.temperature ?? 0.7,
      ...options,
    });

    const content = response.choices[0]?.message?.content?.trim() || '{}';

    try {
      return JSON.parse(content) as T;
    } catch (error) {
      // Extract JSON from the response if needed
      const jsonMatch = content.match(/(\{.*\})/s);
      if (jsonMatch?.[0]) {
        return JSON.parse(jsonMatch[0]) as T;
      }
      throw error;
    }
  }

  /**
   * Generate an XML response from a prompt
   * @param prompt - The text prompt
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The XML string
   */
  async generateXml(
    prompt: string,
    model: MistralModel = 'mistral-medium',
    options: Partial<ChatCompletionOptions> = {},
  ): Promise<string> {
    const fullPrompt = `${prompt}\n\nPlease respond with valid, well-formatted XML only.`;

    const response = await this.createChatCompletion({
      model,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: options.temperature ?? 0.7,
      ...options,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  }

  /**
   * Generate a Markdown response from a prompt
   * @param prompt - The text prompt
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The Markdown string
   */
  async generateMarkdown(
    prompt: string,
    model: MistralModel = 'mistral-medium',
    options: Partial<ChatCompletionOptions> = {},
  ): Promise<string> {
    const fullPrompt = `${prompt}\n\nPlease respond with properly formatted Markdown text only.`;

    const response = await this.createChatCompletion({
      model,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: options.temperature ?? 0.7,
      ...options,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  }

  /**
   * Generate an SQL response from a prompt
   * @param prompt - The text prompt
   * @param dialect - SQL dialect (e.g., "MySQL", "PostgreSQL")
   * @param model - Mistral model to use
   * @param options - Additional options
   * @returns The SQL string
   */
  async generateSql(
    prompt: string,
    dialect: string = 'MySQL',
    model: MistralModel = 'mistral-medium',
    options: Partial<ChatCompletionOptions> = {},
  ): Promise<string> {
    const fullPrompt = `${prompt}\n\nPlease respond with a valid, executable SQL query for ${dialect} database only, no code fences, no explanations.`;

    const response = await this.createChatCompletion({
      model,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: options.temperature ?? 0.7,
      ...options,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  }
}
