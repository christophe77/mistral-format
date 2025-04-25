/**
 * Events Module for Mistral Format Playground
 * 
 * This module sets up event listeners for all user interactions.
 */

import { createLoader, getOptionsFromFields, rawResponses } from './utils.js';

/**
 * Sets up all event listeners for the application
 * @param {Object} elements - Object containing UI element references
 */
export function setupEventListeners(elements) {
  // API Initialization
  setupInitialization(elements.common);
  
  // Formatter event listeners
  setupTextEvents(elements.text);
  setupMarkdownEvents(elements.markdown);
  setupXmlEvents(elements.xml);
  setupSqlEvents(elements.sql);
  setupJsonEvents(elements.json);
}

/**
 * Sets up API initialization event listener
 * @param {Object} elements - Common UI elements
 */
function setupInitialization({ apiKeyInput, initButton, apiStatus }) {
  initButton.addEventListener('click', function () {
    const apiKey = apiKeyInput.value;
    if (!apiKey) {
      apiStatus.innerHTML = '<div class="error">Please enter an API key</div>';
      return;
    }

    try {
      // Initialize the library with the API key and explicitly set to v1 API version
      MistralFormat.init(apiKey, 'v1');
      apiStatus.innerHTML = '<div style="color: green;">✓ API initialized successfully with v1 API</div>';

      // Enable all buttons
      document.querySelectorAll('.test-section button').forEach(button => {
        if (!button.classList.contains('toggle-options')) {
          button.disabled = false;
        }
      });
    } catch (error) {
      apiStatus.innerHTML = `<div class="error">Failed to initialize: ${error.message}</div>`;
    }
  });
}

/**
 * Sets up text generation event listener
 * @param {Object} elements - Text UI elements
 */
function setupTextEvents(elements) {
  elements.button.addEventListener('click', async function () {
    elements.output.innerHTML = '';
    const loader = createLoader();
    elements.output.appendChild(loader);

    try {
      const options = getOptionsFromFields(
        elements.temperature,
        elements.topP,
        elements.maxTokens,
        elements.safeMode,
        elements.randomSeed
      );

      const response = await MistralFormat.sendPrompt(
        elements.prompt.value,
        elements.model.value,
        options
      );

      elements.output.innerHTML = `<p>${response}</p>`;
    } catch (error) {
      elements.output.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
}

/**
 * Sets up markdown generation event listener
 * @param {Object} elements - Markdown UI elements
 */
function setupMarkdownEvents(elements) {
  elements.button.addEventListener('click', async function () {
    elements.raw.innerHTML = '';
    elements.output.innerHTML = '';
    const loader = createLoader();
    elements.output.appendChild(loader);

    try {
      const options = getOptionsFromFields(
        elements.temperature,
        elements.topP,
        elements.maxTokens,
        elements.safeMode,
        elements.randomSeed
      );

      // For demo purposes, simulate what a raw response might look like
      const rawMarkdown = await MistralFormat.sendMarkdownPrompt(
        elements.prompt.value,
        elements.model.value,
        options
      );
      
      // Store raw response for demonstration
      rawResponses.markdown = '```markdown\n' + rawMarkdown + '\n```';
      elements.raw.innerHTML = `<pre>${rawResponses.markdown}</pre>`;

      // Use the formatter to get cleaned response
      const cleanedMarkdown = await MistralFormat.toMarkdown(
        elements.prompt.value,
        {
          model: elements.model.value,
          options: options
        }
      );

      elements.output.innerHTML = `<div class="markdown-content">${cleanedMarkdown}</div>`;
    } catch (error) {
      elements.output.innerHTML = `<div class="error">${error.message}</div>`;
      elements.raw.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
}

/**
 * Sets up XML generation event listener
 * @param {Object} elements - XML UI elements
 */
function setupXmlEvents(elements) {
  elements.button.addEventListener('click', async function () {
    elements.raw.innerHTML = '';
    elements.output.innerHTML = '';
    const loader = createLoader();
    elements.output.appendChild(loader);

    try {
      const options = getOptionsFromFields(
        elements.temperature,
        elements.topP,
        elements.maxTokens,
        elements.safeMode,
        elements.randomSeed
      );

      // For demo purposes, simulate what a raw response might look like
      const rawXml = await MistralFormat.sendXmlPrompt(
        elements.prompt.value,
        elements.model.value,
        options
      );
      
      // Store raw response for demonstration
      rawResponses.xml = '```xml\n' + rawXml + '\n```';
      elements.raw.innerHTML = `<pre>${rawResponses.xml}</pre>`;

      // Use the formatter to get cleaned response
      const cleanedXml = await MistralFormat.toXml(
        elements.prompt.value,
        {
          model: elements.model.value,
          options: options
        }
      );

      elements.output.innerHTML = `<pre class="xml-content">${cleanedXml}</pre>`;
    } catch (error) {
      elements.output.innerHTML = `<div class="error">${error.message}</div>`;
      elements.raw.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
}

/**
 * Sets up SQL generation event listener
 * @param {Object} elements - SQL UI elements
 */
function setupSqlEvents(elements) {
  elements.button.addEventListener('click', async function () {
    elements.raw.innerHTML = '';
    elements.output.innerHTML = '';
    const loader = createLoader();
    elements.output.appendChild(loader);

    try {
      const options = getOptionsFromFields(
        elements.temperature,
        elements.topP,
        elements.maxTokens,
        elements.safeMode,
        elements.randomSeed
      );

      // For demo purposes, simulate what a raw response might look like
      const rawSql = await MistralFormat.sendSqlPrompt(
        elements.prompt.value,
        elements.dialect.value,
        elements.model.value,
        options
      );
      
      // Store raw response for demonstration
      rawResponses.sql = '```sql\n' + rawSql + '\n```';
      elements.raw.innerHTML = `<pre>${rawResponses.sql}</pre>`;

      // Use the formatter to get cleaned response
      const cleanedSql = await MistralFormat.toSQL(
        elements.prompt.value,
        {
          dbType: elements.dialect.value,
          model: elements.model.value,
          options: options
        }
      );

      elements.output.innerHTML = `<pre class="sql-content">${cleanedSql}</pre>`;
    } catch (error) {
      elements.output.innerHTML = `<div class="error">${error.message}</div>`;
      elements.raw.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
}

/**
 * Sets up JSON generation event listener
 * @param {Object} elements - JSON UI elements
 */
function setupJsonEvents(elements) {
  elements.button.addEventListener('click', async function () {
    elements.raw.innerHTML = '';
    elements.output.innerHTML = '';
    const loader = createLoader();
    elements.output.appendChild(loader);

    try {
      const options = getOptionsFromFields(
        elements.temperature,
        elements.topP,
        elements.maxTokens,
        elements.safeMode,
        elements.randomSeed
      );

      let schemaObj = null;
      let typeDefinition = null;

      try {
        if (elements.schema.value) {
          // Try to parse as JSON schema
          schemaObj = JSON.parse(elements.schema.value);
        }
      } catch (e) {
        // If not valid JSON, treat as TypeScript type definition
        typeDefinition = elements.schema.value;
      }

      // Get the raw JSON first for demonstration
      let rawJson;
      if (typeDefinition) {
        rawJson = await MistralFormat.sendJsonPromptWithSchema(
          elements.prompt.value,
          null,
          elements.model.value,
          options,
          typeDefinition
        );
      } else {
        rawJson = await MistralFormat.sendJsonPromptWithSchema(
          elements.prompt.value,
          schemaObj,
          elements.model.value,
          options
        );
      }

      // Store raw response for demonstration
      rawResponses.json = '```json\n' + JSON.stringify(rawJson, null, 2) + '\n```';
      elements.raw.innerHTML = `<pre>${rawResponses.json}</pre>`;

      // Use the formatter to get cleaned and parsed response
      const jsonResponse = await MistralFormat.toJson(
        elements.prompt.value,
        {
          schema: schemaObj,
          typeDefinition: typeDefinition,
          model: elements.model.value,
          options: options
        }
      );

      // Format the output for display
      elements.output.innerHTML = `<pre class="json-content">${JSON.stringify(jsonResponse, null, 2)}</pre>`;
    } catch (error) {
      elements.output.innerHTML = `<div class="error">${error.message}</div>`;
      elements.raw.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
} 