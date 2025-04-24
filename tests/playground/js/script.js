document.addEventListener('DOMContentLoaded', function() {
  // Get UI elements
  const apiKeyInput = document.getElementById('api-key');
  const initButton = document.getElementById('init-button');
  const apiStatus = document.getElementById('api-status');
  
  // Text elements
  const textPrompt = document.getElementById('text-prompt');
  const textModel = document.getElementById('text-model');
  const textButton = document.getElementById('text-button');
  const textOutput = document.getElementById('text-output');
  const textOptionsToggle = document.getElementById('text-options-toggle');
  const textAdvancedOptions = document.getElementById('text-advanced-options');
  const textTemperature = document.getElementById('text-temperature');
  const textTopP = document.getElementById('text-top-p');
  const textMaxTokens = document.getElementById('text-max-tokens');
  const textSafeMode = document.getElementById('text-safe-mode');
  const textRandomSeed = document.getElementById('text-random-seed');
  
  // Markdown elements
  const markdownPrompt = document.getElementById('markdown-prompt');
  const markdownModel = document.getElementById('markdown-model');
  const markdownButton = document.getElementById('markdown-button');
  const markdownRaw = document.getElementById('markdown-raw');
  const markdownOutput = document.getElementById('markdown-output');
  const markdownOptionsToggle = document.getElementById('markdown-options-toggle');
  const markdownAdvancedOptions = document.getElementById('markdown-advanced-options');
  const markdownTemperature = document.getElementById('markdown-temperature');
  const markdownTopP = document.getElementById('markdown-top-p');
  const markdownMaxTokens = document.getElementById('markdown-max-tokens');
  const markdownSafeMode = document.getElementById('markdown-safe-mode');
  const markdownRandomSeed = document.getElementById('markdown-random-seed');
  
  // XML elements
  const xmlPrompt = document.getElementById('xml-prompt');
  const xmlModel = document.getElementById('xml-model');
  const xmlButton = document.getElementById('xml-button');
  const xmlRaw = document.getElementById('xml-raw');
  const xmlOutput = document.getElementById('xml-output');
  const xmlOptionsToggle = document.getElementById('xml-options-toggle');
  const xmlAdvancedOptions = document.getElementById('xml-advanced-options');
  const xmlTemperature = document.getElementById('xml-temperature');
  const xmlTopP = document.getElementById('xml-top-p');
  const xmlMaxTokens = document.getElementById('xml-max-tokens');
  const xmlSafeMode = document.getElementById('xml-safe-mode');
  const xmlRandomSeed = document.getElementById('xml-random-seed');
  
  // SQL elements
  const sqlPrompt = document.getElementById('sql-prompt');
  const sqlModel = document.getElementById('sql-model');
  const sqlDialect = document.getElementById('sql-dialect');
  const sqlButton = document.getElementById('sql-button');
  const sqlRaw = document.getElementById('sql-raw');
  const sqlOutput = document.getElementById('sql-output');
  const sqlOptionsToggle = document.getElementById('sql-options-toggle');
  const sqlAdvancedOptions = document.getElementById('sql-advanced-options');
  const sqlTemperature = document.getElementById('sql-temperature');
  const sqlTopP = document.getElementById('sql-top-p');
  const sqlMaxTokens = document.getElementById('sql-max-tokens');
  const sqlSafeMode = document.getElementById('sql-safe-mode');
  const sqlRandomSeed = document.getElementById('sql-random-seed');
  
  // JSON elements
  const jsonPrompt = document.getElementById('json-prompt');
  const jsonModel = document.getElementById('json-model');
  const jsonButton = document.getElementById('json-button');
  const jsonRaw = document.getElementById('json-raw');
  const jsonOutput = document.getElementById('json-output');
  const jsonOptionsToggle = document.getElementById('json-options-toggle');
  const jsonAdvancedOptions = document.getElementById('json-advanced-options');
  const jsonTemperature = document.getElementById('json-temperature');
  const jsonTopP = document.getElementById('json-top-p');
  const jsonMaxTokens = document.getElementById('json-max-tokens');
  const jsonSafeMode = document.getElementById('json-safe-mode');
  const jsonRandomSeed = document.getElementById('json-random-seed');
  const jsonSchema = document.getElementById('json-schema');
  
  // Setup toggle buttons for advanced options
  [
    { toggle: textOptionsToggle, panel: textAdvancedOptions },
    { toggle: markdownOptionsToggle, panel: markdownAdvancedOptions },
    { toggle: xmlOptionsToggle, panel: xmlAdvancedOptions },
    { toggle: sqlOptionsToggle, panel: sqlAdvancedOptions },
    { toggle: jsonOptionsToggle, panel: jsonAdvancedOptions }
  ].forEach(({ toggle, panel }) => {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('visible');
      toggle.textContent = panel.classList.contains('visible') 
        ? 'Hide Advanced Options' 
        : 'Advanced Options';
    });
  });
  
  // Helper function to get options from form fields
  function getOptionsFromFields(temperature, topP, maxTokens, safeMode, randomSeed) {
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
  
  // Mock function for raw responses - in a real environment, we'd capture these differently
  // This is just for demonstration
  let rawResponses = {
    markdown: "",
    xml: "",
    sql: "",
    json: ""
  };
  
  // Disable all buttons initially
  [textButton, markdownButton, xmlButton, sqlButton, jsonButton].forEach(button => {
    button.disabled = true;
  });
  
  // Create a loader element
  function createLoader() {
    const loader = document.createElement('span');
    loader.className = 'loader';
    return loader;
  }
  
  // Initialize the API
  initButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value;
    if (!apiKey) {
      apiStatus.innerHTML = '<div class="error">Please enter an API key</div>';
      return;
    }
    
    try {
      // Initialize the library with the API key
      MistralFormat.init(apiKey);
      apiStatus.innerHTML = '<div style="color: green;">✓ API initialized successfully</div>';
      
      // Enable all buttons
      [textButton, markdownButton, xmlButton, sqlButton, jsonButton].forEach(button => {
        button.disabled = false;
      });
    } catch (error) {
      apiStatus.innerHTML = `<div class="error">Failed to initialize: ${error.message}</div>`;
    }
  });
  
  // Text generation
  textButton.addEventListener('click', async function() {
    textOutput.innerHTML = '';
    const loader = createLoader();
    textOutput.appendChild(loader);
    
    try {
      const options = getOptionsFromFields(
        textTemperature, 
        textTopP, 
        textMaxTokens, 
        textSafeMode, 
        textRandomSeed
      );
      
      const response = await MistralFormat.sendPrompt(
        textPrompt.value, 
        textModel.value,
        options
      );
      
      textOutput.innerHTML = `<p>${response}</p>`;
    } catch (error) {
      textOutput.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
  
  // Generate Markdown
  markdownButton.addEventListener('click', async function() {
    markdownRaw.innerHTML = '';
    markdownOutput.innerHTML = '';
    const loader = createLoader();
    markdownOutput.appendChild(loader);
    
    try {
      // For demo purposes, we'll first show what a raw response might look like
      // In a real environment, we'd need to intercept this before cleaning
      const mockRawResponse = "```markdown\n# Artificial Intelligence\n\nArtificial Intelligence (AI) is a branch of computer science...\n```";
      markdownRaw.textContent = mockRawResponse;
      
      const options = getOptionsFromFields(
        markdownTemperature, 
        markdownTopP, 
        markdownMaxTokens, 
        markdownSafeMode, 
        markdownRandomSeed
      );
      
      // Get the real cleaned response
      const response = await MistralFormat.toMarkdown(markdownPrompt.value, {
        model: markdownModel.value,
        options: options
      });
      
      // Display the cleaned response
      markdownOutput.textContent = response;
    } catch (error) {
      markdownOutput.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
  
  // Generate XML
  xmlButton.addEventListener('click', async function() {
    xmlRaw.innerHTML = '';
    xmlOutput.innerHTML = '';
    const loader = createLoader();
    xmlOutput.appendChild(loader);
    
    try {
      // For demo purposes, we'll first show what a raw response might look like
      const mockRawResponse = "```xml\n<languages>\n  <language>\n    <name>Python</name>\n    <features>\n      <feature>Easy to learn</feature>\n      <feature>Versatile</feature>\n      <feature>Large ecosystem</feature>\n    </features>\n  </language>\n  <!-- More languages... -->\n</languages>\n```";
      xmlRaw.textContent = mockRawResponse;
      
      const options = getOptionsFromFields(
        xmlTemperature, 
        xmlTopP, 
        xmlMaxTokens, 
        xmlSafeMode, 
        xmlRandomSeed
      );
      
      // Get the real cleaned response
      const response = await MistralFormat.toXml(xmlPrompt.value, {
        model: xmlModel.value,
        options: options
      });
      
      // Display the cleaned response
      xmlOutput.textContent = response;
    } catch (error) {
      xmlOutput.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
  
  // Generate SQL
  sqlButton.addEventListener('click', async function() {
    sqlRaw.innerHTML = '';
    sqlOutput.innerHTML = '';
    const loader = createLoader();
    sqlOutput.appendChild(loader);
    
    try {
      // For demo purposes, we'll first show what a raw response might look like
      const mockRawResponse = "```sql\nSELECT * FROM users\nWHERE registration_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH);\n```";
      sqlRaw.textContent = mockRawResponse;
      
      const options = getOptionsFromFields(
        sqlTemperature, 
        sqlTopP, 
        sqlMaxTokens, 
        sqlSafeMode, 
        sqlRandomSeed
      );
      
      // Get the real cleaned response
      const response = await MistralFormat.toSQL(sqlPrompt.value, {
        model: sqlModel.value,
        dbType: MistralFormat.SQLDatabaseType[sqlDialect.value.toUpperCase().replace(/\s+/g, '')],
        options: options
      });
      
      // Display the cleaned response
      sqlOutput.textContent = response;
    } catch (error) {
      sqlOutput.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
  
  // Generate JSON
  jsonButton.addEventListener('click', async function() {
    jsonRaw.innerHTML = '';
    jsonOutput.innerHTML = '';
    const loader = createLoader();
    jsonOutput.appendChild(loader);
    
    try {
      // For demo purposes, we'll first show what a raw response might look like
      const mockRawResponse = "```json\n{\n  \"name\": \"John Doe\",\n  \"age\": 35,\n  \"email\": \"john.doe@example.com\",\n  \"occupation\": \"Software Engineer\",\n  \"location\": \"New York\"\n}\n```";
      jsonRaw.textContent = mockRawResponse;
      
      const options = getOptionsFromFields(
        jsonTemperature, 
        jsonTopP, 
        jsonMaxTokens, 
        jsonSafeMode, 
        jsonRandomSeed
      );
      
      // Create config object for JSON
      const jsonConfig = {
        model: jsonModel.value,
        options: options
      };
      
      // Add schema if provided
      if (jsonSchema.value.trim()) {
        try {
          jsonConfig.schema = JSON.parse(jsonSchema.value);
        } catch (e) {
          jsonOutput.innerHTML = `<div class="error">Invalid JSON schema: ${e.message}</div>`;
          return;
        }
      } else {
        // Default schema if none provided
        jsonConfig.schema = {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "number" },
            email: { type: "string" }
          }
        };
      }
      
      // Get the real response (already parsed, so we need to stringify it for display)
      const response = await MistralFormat.toJson(jsonPrompt.value, jsonConfig);
      
      // Display the cleaned response
      jsonOutput.textContent = JSON.stringify(response, null, 2);
    } catch (error) {
      jsonOutput.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
}); 