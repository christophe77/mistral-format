// Only import dotenv in Node.js environment (not browser)
if (typeof window === 'undefined') {
  // Server-side only
  require('dotenv').config();
}

// In-memory configuration store
let config = {
  apiKey: '',
  apiVersion: 'v1'
};

// Load environment variables
interface Env {
  MISTRAL_API_KEY: string;
}

// Store for setApiKey client function
let setApiKeyFn: ((key: string) => void) | null = null;

/**
 * Set the client's setApiKey function
 * This allows the config module to update the client when initialized
 */
export function _setApiKeyFunction(fn: (key: string) => void): void {
  setApiKeyFn = fn;
}

/**
 * Initialize the library with configuration
 * @param apiKey - Mistral API key
 * @param apiVersion - Mistral API version (default: 'v1')
 */
export function init(apiKey: string, apiVersion: string = 'v1'): void {
  config.apiKey = apiKey;
  config.apiVersion = apiVersion;
  
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

/**
 * Get the current API version
 */
export const getApiVersion = (): string => {
  return config.apiVersion;
};

// Function to safely access environment variables
export const getEnv = (): Env => {
  return {
    MISTRAL_API_KEY: getApiKey(),
  };
}; 