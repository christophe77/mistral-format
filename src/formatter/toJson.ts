import { sendJsonPrompt } from '../client';
import { safeExecute } from '../errors';
import { ChatCompletionOptions, MistralModel } from '../types';

/**
 * Generate a response in JSON format
 * @param prompt The user's prompt
 * @param typeSchema Class constructor for the expected response type
 * @param model Optional Mistral AI model to use
 * @param options Additional request options
 * @returns Parsed JSON object of type T
 */
export async function toJson<T>(
	prompt: string,
	typeSchema: new () => T,
	model?: MistralModel,
	options?: Partial<ChatCompletionOptions>
): Promise<T> {
	return safeExecute(async () => {
		return await sendJsonPrompt<T>(prompt, typeSchema, model, options);
	}, "Failed to parse JSON response");
}
