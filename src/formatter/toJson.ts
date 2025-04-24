import { sendJsonPrompt, sendJsonPromptWithSchema } from '../client';
import { safeExecute } from '../errors';
import { ChatCompletionOptions, MistralModel } from '../types';

/**
 * Options for JSON generation
 */
export interface JsonOptions {
	/** Class constructor for the expected response type */
	typeSchema?: new () => any;
	/** TypeScript type definition as a string */
	typeDefinition?: string;
	/** Mistral AI model to use */
	model?: MistralModel;
	/** Additional request options */
	options?: Partial<ChatCompletionOptions>;
	/** JSON schema object (alternative to typeSchema) */
	schema?: object;
}

/**
 * Generate a response in JSON format
 * @param prompt The user's prompt
 * @param options Generation options
 * @returns Parsed JSON object of type T
 */
export async function toJson<T = any>(
	prompt: string,
	options: JsonOptions = {}
): Promise<T> {
	return safeExecute(async () => {
		const { typeSchema, model, options: requestOptions, schema, typeDefinition } = options;
		
		// If typeSchema is provided, use it
		if (typeSchema) {
			return await sendJsonPrompt<T>(prompt, typeSchema, model, requestOptions);
		}
		
		// Otherwise use schema or typeDefinition
		return await sendJsonPromptWithSchema<T>(
			prompt, 
			schema, 
			model, 
			requestOptions,
			typeDefinition
		);
	}, "Failed to parse JSON response");
}
