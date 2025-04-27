// browser.ts - Entry point for browser builds
// Imports everything from index.ts but with browser-specific optimizations

// Re-export everything from the main index
export * from './index';

// Default export for UMD builds
import MistralFormat from './index';
export default MistralFormat; 