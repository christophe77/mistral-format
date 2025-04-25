/**
 * Utilities Module for Mistral Format Playground
 * 
 * This module contains utility functions used throughout the application.
 */

/**
 * Creates a loader element for displaying during API calls
 * @returns {HTMLElement} Loader element
 */
export function createLoader() {
  const loader = document.createElement('span');
  loader.className = 'loader';
  return loader;
}

/**
 * Parses options from form fields
 * @param {HTMLElement} temperature - Temperature input element
 * @param {HTMLElement} topP - Top P input element
 * @param {HTMLElement} maxTokens - Max tokens input element
 * @param {HTMLElement} safeMode - Safe mode checkbox element
 * @param {HTMLElement} randomSeed - Random seed input element
 * @returns {Object} Options object for API calls
 */
export function getOptionsFromFields(temperature, topP, maxTokens, safeMode, randomSeed) {
  const options = {};

  if (!isNaN(parseFloat(temperature.value))) {
    options.temperature = parseFloat(temperature.value);
  }

  if (!isNaN(parseFloat(topP.value))) {
    options.top_p = parseFloat(topP.value);
  }

  if (maxTokens.value && !isNaN(parseInt(maxTokens.value))) {
    options.max_tokens = parseInt(maxTokens.value);
  }

  if (safeMode.checked) {
    options.safe_mode = true;
  }

  if (randomSeed.value && !isNaN(parseInt(randomSeed.value))) {
    options.random_seed = parseInt(randomSeed.value);
  }

  return options;
}

/**
 * Object to store raw responses for demonstration
 */
export const rawResponses = {
  markdown: "",
  xml: "",
  sql: "",
  json: ""
}; 