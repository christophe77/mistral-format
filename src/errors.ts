/**
 * Global error management for Mistral Connector
 */

// Base error class for all application errors
export class MistralError extends Error {
  constructor(message: string, public readonly code: string = 'MISTRAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    // This maintains proper stack trace in modern JS engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// API-related errors
export class APIError extends MistralError {
  constructor(
    message: string, 
    public readonly statusCode?: number, 
    public readonly response?: any
  ) {
    super(message, 'API_ERROR');
  }
}

// Parsing-related errors
export class ParseError extends MistralError {
  constructor(
    message: string, 
    public readonly originalError?: Error,
    public readonly originalContent?: string
  ) {
    super(message, 'PARSE_ERROR');
  }
}

// Authentication-related errors
export class AuthError extends MistralError {
  constructor(message: string = 'Missing or invalid API key') {
    super(message, 'AUTH_ERROR');
  }
}

// Global error handler
export function handleError(error: unknown): MistralError {
  // Already a MistralError
  if (error instanceof MistralError) {
    return error;
  }
  
  // Standard Error
  if (error instanceof Error) {
    // API responses with status code
    if ('status' in error && typeof (error as any).status === 'number') {
      return new APIError(
        error.message,
        (error as any).status,
        (error as any).response
      );
    }
    
    // JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return new ParseError(error.message, error);
    }
    
    // Generic error fallback
    return new MistralError(error.message);
  }
  
  // Unknown error types
  return new MistralError(String(error));
}

// Helper to safely execute a function with error handling
export async function safeExecute<T>(
  fn: () => Promise<T>,
  errorMessage = 'Operation failed'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw handleError(error);
  }
} 