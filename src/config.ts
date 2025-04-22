// Only import dotenv in Node.js environment (not browser)
if (typeof window === 'undefined') {
  // Server-side only
  require('dotenv').config();
}

// In-memory configuration store
let config = {
  apiKey: ''
};

// Load environment variables
interface Env {
  MISTRAL_API_KEY: string;
}

// This import is deferred to avoid circular dependencies
let setApiKeyFn: ((key: string) => void) | null = null;

/**
 * Set the function to update API key in the client
 * @internal Used by the internal API to avoid circular dependencies
 */
export function _setApiKeyFunction(fn: (key: string) => void): void {
  setApiKeyFn = fn;
}

/**
 * Initialize the library with configuration
 * @param apiKey - Mistral API key
 */
export function init(apiKey: string): void {
  config.apiKey = apiKey;
  
  // If we have the client's setApiKey function, call it
  if (setApiKeyFn) {
    setApiKeyFn(apiKey);
  }
}

/**
 * Get the current API key
 * Priority:
 * 1. API key set via init()
 * 2. API key from environment variable
 */
export const getApiKey = (): string => {
  if (config.apiKey) {
    return config.apiKey;
  }
  
  // Fallback to env var if no explicitly set key
  return typeof process !== 'undefined' && process.env.MISTRAL_API_KEY || '';
};

// Function to safely access environment variables
export const getEnv = (): Env => {
  return {
    MISTRAL_API_KEY: getApiKey(),
  };
}; 