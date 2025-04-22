import { sendMarkdownPrompt } from '../client';
import { safeExecute } from '../errors';
import { ChatCompletionOptions, MistralModel } from '../types';

/**
 * Generate a response in Markdown format
 * @param prompt The user's prompt
 * @param model Optional Mistral AI model to use
 * @param options Additional request options
 * @returns Formatted Markdown string
 */
export async function toMarkdown(
  prompt: string, 
  model?: MistralModel,
  options?: Partial<ChatCompletionOptions>
): Promise<string> {
  return safeExecute(async () => {
    return await sendMarkdownPrompt(prompt, model, options);
  }, "Failed to generate Markdown response");
}
