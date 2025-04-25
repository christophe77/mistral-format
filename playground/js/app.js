/**
 * Mistral Format Playground Application
 * 
 * This file contains the main application logic for the Mistral Format playground.
 */

// Import modules
import { setupUI } from './ui.js';
import { setupEventListeners } from './events.js';
import { createLoader, getOptionsFromFields } from './utils.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Setup UI elements
  const elements = setupUI();
  
  // Setup event listeners
  setupEventListeners(elements);
}); 