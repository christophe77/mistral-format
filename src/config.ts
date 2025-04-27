// Import package.json for version information
import packageJson from '../package.json';
const { version } = packageJson;

// Initialize dotenv only in Node.js environment
if (typeof process !== 'undefined' && process.env) {
  // Dynamic import for dotenv to reduce bundle size in browsers
  void import('dotenv').then(dotenv => dotenv.config());
}

interface ConfigStore {
  apiKey: string | null;
  setApiKeyFn: ((key: string) => void) | null;
  apiVersion: string;
}

// Configuration store for Mistral Format
const configStore: ConfigStore = {
  apiKey: (typeof process !== 'undefined' && process.env && process.env.MISTRAL_API_KEY) || null,
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
  return version; // Read from package.json
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
