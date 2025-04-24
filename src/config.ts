import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

interface ConfigStore {
  apiKey: string | null;
  setApiKeyFn: ((key: string) => void) | null;
  version: string;
}

// Configuration store for Mistral Format
const configStore: ConfigStore = {
  apiKey: process.env.MISTRAL_API_KEY || null,
  setApiKeyFn: null,
  version: '0.1.0',
};

/**
 * Set the API key for Mistral API
 * @param apiKey - The API key to set
 */
export function setApiKey(apiKey: string): void {
  configStore.apiKey = apiKey;
  if (configStore.setApiKeyFn) {
    configStore.setApiKeyFn(apiKey);
  }
}

/**
 * Register a function to be called when the API key is set
 * @param fn - The function to call
 */
export function onApiKeyChange(fn: (key: string) => void): void {
  configStore.setApiKeyFn = fn;
}

/**
 * Get the current API key
 * @returns The current API key or null if not set
 */
export function getApiKey(): string | null {
  return configStore.apiKey;
}

/**
 * Get the current version of the library
 * @returns The current version
 */
export function getVersion(): string {
  return configStore.version;
}
