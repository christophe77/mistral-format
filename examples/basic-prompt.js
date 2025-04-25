// Example of basic prompt
const { init, sendPrompt, getVersionInfo } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = "your_api_key_here"; // Replace with your API key
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    // Get version info
    const versionInfo = getVersionInfo();
    
    // Get the raw API client
    const MistralApi = require('../dist').MistralApi;
    const api = new MistralApi(MISTRAL_API_KEY, 'v1');
    
    // Use reflection to access the private property
    const props = Object.entries(api);
    const chatCompletionsUrl = props.find(([key]) => key.includes('chatCompletionsUrl'));
    
    // Test direct endpoint first
    await fetch(chatCompletionsUrl[1], {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mistral-medium",
        messages: [{ role: "user", content: "What is the capital of France?" }]
      }),
    });
    
    // Call the API class directly
    await api.generateText("What is the capital of France?", "mistral-medium");
    
    // Now trying with the sendPrompt function
    const response = await sendPrompt("What is the capital of France?");
    return response;
  } catch (error) {
    throw error;
  }
}

main(); 