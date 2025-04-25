/**
 * UI Module for Mistral Format Playground
 * 
 * This module handles the UI elements and their initial setup.
 */

/**
 * Sets up all UI element references
 * @returns {Object} Object containing all UI element references
 */
export function setupUI() {
  // Common UI elements
  const apiKeyInput = document.getElementById('api-key');
  const initButton = document.getElementById('init-button');
  const apiStatus = document.getElementById('api-status');

  // Text elements
  const textElements = {
    prompt: document.getElementById('text-prompt'),
    model: document.getElementById('text-model'),
    button: document.getElementById('text-button'),
    output: document.getElementById('text-output'),
    optionsToggle: document.getElementById('text-options-toggle'),
    advancedOptions: document.getElementById('text-advanced-options'),
    temperature: document.getElementById('text-temperature'),
    topP: document.getElementById('text-top-p'),
    maxTokens: document.getElementById('text-max-tokens'),
    safeMode: document.getElementById('text-safe-mode'),
    randomSeed: document.getElementById('text-random-seed')
  };

  // Markdown elements
  const markdownElements = {
    prompt: document.getElementById('markdown-prompt'),
    model: document.getElementById('markdown-model'),
    button: document.getElementById('markdown-button'),
    raw: document.getElementById('markdown-raw'),
    output: document.getElementById('markdown-output'),
    optionsToggle: document.getElementById('markdown-options-toggle'),
    advancedOptions: document.getElementById('markdown-advanced-options'),
    temperature: document.getElementById('markdown-temperature'),
    topP: document.getElementById('markdown-top-p'),
    maxTokens: document.getElementById('markdown-max-tokens'),
    safeMode: document.getElementById('markdown-safe-mode'),
    randomSeed: document.getElementById('markdown-random-seed')
  };

  // XML elements
  const xmlElements = {
    prompt: document.getElementById('xml-prompt'),
    model: document.getElementById('xml-model'),
    button: document.getElementById('xml-button'),
    raw: document.getElementById('xml-raw'),
    output: document.getElementById('xml-output'),
    optionsToggle: document.getElementById('xml-options-toggle'),
    advancedOptions: document.getElementById('xml-advanced-options'),
    temperature: document.getElementById('xml-temperature'),
    topP: document.getElementById('xml-top-p'),
    maxTokens: document.getElementById('xml-max-tokens'),
    safeMode: document.getElementById('xml-safe-mode'),
    randomSeed: document.getElementById('xml-random-seed')
  };

  // SQL elements
  const sqlElements = {
    prompt: document.getElementById('sql-prompt'),
    model: document.getElementById('sql-model'),
    dialect: document.getElementById('sql-dialect'),
    button: document.getElementById('sql-button'),
    raw: document.getElementById('sql-raw'),
    output: document.getElementById('sql-output'),
    optionsToggle: document.getElementById('sql-options-toggle'),
    advancedOptions: document.getElementById('sql-advanced-options'),
    temperature: document.getElementById('sql-temperature'),
    topP: document.getElementById('sql-top-p'),
    maxTokens: document.getElementById('sql-max-tokens'),
    safeMode: document.getElementById('sql-safe-mode'),
    randomSeed: document.getElementById('sql-random-seed')
  };

  // JSON elements
  const jsonElements = {
    prompt: document.getElementById('json-prompt'),
    model: document.getElementById('json-model'),
    button: document.getElementById('json-button'),
    raw: document.getElementById('json-raw'),
    output: document.getElementById('json-output'),
    optionsToggle: document.getElementById('json-options-toggle'),
    advancedOptions: document.getElementById('json-advanced-options'),
    temperature: document.getElementById('json-temperature'),
    topP: document.getElementById('json-top-p'),
    maxTokens: document.getElementById('json-max-tokens'),
    safeMode: document.getElementById('json-safe-mode'),
    randomSeed: document.getElementById('json-random-seed'),
    schema: document.getElementById('json-schema')
  };

  // Disable all buttons initially
  [
    textElements.button, 
    markdownElements.button, 
    xmlElements.button, 
    sqlElements.button, 
    jsonElements.button
  ].forEach(button => {
    button.disabled = true;
  });

  // Setup toggle buttons for advanced options
  [
    { toggle: textElements.optionsToggle, panel: textElements.advancedOptions },
    { toggle: markdownElements.optionsToggle, panel: markdownElements.advancedOptions },
    { toggle: xmlElements.optionsToggle, panel: xmlElements.advancedOptions },
    { toggle: sqlElements.optionsToggle, panel: sqlElements.advancedOptions },
    { toggle: jsonElements.optionsToggle, panel: jsonElements.advancedOptions }
  ].forEach(({ toggle, panel }) => {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('visible');
      toggle.textContent = panel.classList.contains('visible')
        ? 'Hide Advanced Options'
        : 'Advanced Options';
    });
  });

  return {
    common: {
      apiKeyInput,
      initButton,
      apiStatus
    },
    text: textElements,
    markdown: markdownElements,
    xml: xmlElements,
    sql: sqlElements,
    json: jsonElements
  };
} 