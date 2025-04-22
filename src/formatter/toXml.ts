import { sendXmlPrompt } from '../client';
import { safeExecute } from '../errors';
import { ChatCompletionOptions, MistralModel } from '../types';

/**
 * Generate a response in XML format
 * @param prompt The user's prompt
 * @param model Optional Mistral AI model to use
 * @param options Additional request options
 * @returns Formatted XML string
 */
export async function toXml(
  prompt: string, 
  model?: MistralModel,
  options?: Partial<ChatCompletionOptions>
): Promise<string> {
  return safeExecute(async () => {
    return await sendXmlPrompt(prompt, model, options);
  }, "Failed to generate XML response");
}
