import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

interface ConfigStore {
  apiKey: string | null;
  setApiKeyFn: ((key: string) => void) | null;
  apiVersion: string;
}

// Configuration store for Mistral Format
const configStore: ConfigStore = {
  apiKey: process.env.MISTRAL_API_KEY || null,
  setApiKeyFn: null,
  apiVersion: 'v1',
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
 * Set the API version for Mistral API
 * @param version - The API version to set
 */
export function setApiVersion(version: string): void {
  configStore.apiVersion = version;
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
 * Get the current API version
 * @returns The current API version
 */
export function getApiVersion(): string {
  return configStore.apiVersion;
}

/**
 * Get the current version of the library
 * @returns The current version
 */
export function getVersion(): string {
  return '1.0.5'; // Should match package.json version
}

/**
 * Get the version information including both library and API versions
 * @returns Object containing library and API versions
 */
export function getVersionInfo(): { libraryVersion: string; apiVersion: string } {
  return {
    libraryVersion: getVersion(),
    apiVersion: getApiVersion(),
  };
}
