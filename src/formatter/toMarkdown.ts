import { sendMarkdownPrompt } from '../client';
import { safeExecute } from '../errors';
import { ChatCompletionOptions, MistralModel } from '../types';

/**
 * Options for Markdown generation
 */
export interface MarkdownOptions {
  /** Mistral AI model to use */
  model?: MistralModel;
  /** Additional request options */
  options?: Partial<ChatCompletionOptions>;
}

/**
 * Clean Markdown response by removing extra backticks and code fence markers
 * @param text Raw response from AI
 * @returns Cleaned markdown text
 */
function cleanMarkdownResponse(text: string): string {
  if (!text) return '';
  
  // Remove markdown code fence if present
  let cleaned = text;
  
  // Remove leading/trailing ```markdown or ```md fences
  cleaned = cleaned.replace(/^```(?:markdown|md)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```\s*$/, '');
  
  // If still surrounded by plain backtick fences, remove them too
  if (cleaned.startsWith('`') && cleaned.endsWith('`')) {
    cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '');
  }
  
  return cleaned.trim();
}

/**
 * Generate a response in Markdown format
 * @param prompt The user's prompt
 * @param options Generation options
 * @returns Formatted Markdown string
 */
export async function toMarkdown(
  prompt: string, 
  options: MarkdownOptions = {}
): Promise<string> {
  return safeExecute(async () => {
    const { model, options: requestOptions } = options;
    const response = await sendMarkdownPrompt(prompt, model, requestOptions);
    return cleanMarkdownResponse(response);
  }, "Failed to generate Markdown response");
}
