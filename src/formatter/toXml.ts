import { sendXmlPrompt } from '../client';
import { safeExecute } from '../errors';
import { ChatCompletionOptions, MistralModel } from '../types';

/**
 * Options for XML generation
 */
export interface XmlOptions {
  /** Mistral AI model to use */
  model?: MistralModel;
  /** Additional request options */
  options?: Partial<ChatCompletionOptions>;
}

/**
 * Clean XML response by removing extra backticks and code fence markers
 * @param text Raw response from AI
 * @returns Cleaned XML text
 */
function cleanXmlResponse(text: string): string {
  if (!text) return '';
  
  // Remove XML code fence if present
  let cleaned = text;
  
  // Remove leading/trailing ```xml fences
  cleaned = cleaned.replace(/^```(?:xml)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```\s*$/, '');
  
  // If still surrounded by plain backtick fences, remove them too
  if (cleaned.startsWith('`') && cleaned.endsWith('`')) {
    cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '');
  }
  
  return cleaned.trim();
}

/**
 * Generate a response in XML format
 * @param prompt The user's prompt
 * @param options Generation options
 * @returns Formatted XML string
 */
export async function toXml(
  prompt: string, 
  options: XmlOptions = {}
): Promise<string> {
  return safeExecute(async () => {
    const { model, options: requestOptions } = options;
    const response = await sendXmlPrompt(prompt, model, requestOptions);
    return cleanXmlResponse(response);
  }, "Failed to generate XML response");
}
