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
 * Clean JSON response by removing extra backticks and code fence markers
 * @param text Raw response from AI
 * @returns Cleaned JSON string
 */
function cleanJsonResponse(text: string): string {
	if (!text) return '{}';
	
	// Remove JSON code fence if present
	let cleaned = text;
	
	// Remove leading/trailing ```json fences
	cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
	cleaned = cleaned.replace(/\s*```\s*$/, '');
	
	// If still surrounded by plain backtick fences, remove them too
	if (cleaned.startsWith('`') && cleaned.endsWith('`')) {
		cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '');
	}
	
	return cleaned.trim();
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
			const response = await sendJsonPrompt<T>(prompt, typeSchema, model, requestOptions);
			return response; // Already parsed by sendJsonPrompt
		}
		
		// Otherwise use schema or typeDefinition
		const jsonResponse = await sendJsonPromptWithSchema<T>(
			prompt, 
			schema, 
			model, 
			requestOptions,
			typeDefinition
		);
		
		return jsonResponse; // Already parsed by sendJsonPromptWithSchema
	}, "Failed to parse JSON response");
}
