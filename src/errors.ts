/**
 * Global error management for Mistral Connector
 */

// Base error class for all application errors
export class MistralError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MistralError';
  }
}

interface APIErrorResponse {
  status: number;
  text: string;
}

// API-related errors
export class APIError extends MistralError {
  status: number;
  response: APIErrorResponse;

  constructor(message: string, status: number, response: string | object) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = {
      status,
      text: typeof response === 'string' ? response : JSON.stringify(response),
    };
  }
}

// Parsing-related errors
export class ParseError extends MistralError {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

// Authentication-related errors
export class AuthError extends MistralError {
  constructor() {
    super('Authentication failed: API key is missing or invalid');
    this.name = 'AuthError';
  }
}

// Global error handler
export function handleError(error: Error): never {
  if (error instanceof MistralError) {
    throw error;
  }
  throw new MistralError(`Unexpected error: ${error.message}`);
}

/**
 * Execute a function safely and handle errors
 * @param fn - The function to execute
 * @param fallbackMessage - Fallback error message
 * @returns The result of the function
 */
export async function safeExecute<T>(fn: () => Promise<T>, fallbackMessage: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof MistralError) {
      throw error;
    }
    throw new MistralError(fallbackMessage);
  }
}
