// Example of basic prompt
const { init, sendPrompt, getVersionInfo } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = "your_api_key_here"; // Replace with your API key
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    // Log version info for debugging
    const versionInfo = getVersionInfo();
    console.log("Library version:", versionInfo.libraryVersion);
    console.log("API Version:", versionInfo.apiVersion);
    
    // Get the raw API client to inspect the endpoint URL
    const MistralApi = require('../dist').MistralApi;
    const api = new MistralApi(MISTRAL_API_KEY, 'v1');
    console.log("API Base URL:", api.apiBaseUrl);
    
    // Use reflection to access the private property
    const props = Object.entries(api);
    const chatCompletionsUrl = props.find(([key]) => key.includes('chatCompletionsUrl'));
    
    if (chatCompletionsUrl) {
      console.log("Chat Completions URL:", chatCompletionsUrl[1]);
    }
    
    // Test direct endpoint first
    console.log("\nTesting endpoint directly first...");
    const directRes = await fetch(chatCompletionsUrl[1], {
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
    
    console.log("Direct request status:", directRes.status);
    console.log("Direct response:", await directRes.text());
    
    console.log("\nNow trying with the API class directly:");
    try {
      // Call the API class directly
      const apiResponse = await api.generateText("What is the capital of France?", "mistral-medium");
      console.log("API class response:", apiResponse);
    } catch (error) {
      console.error("API class error:", error.message);
      if (error.statusCode) console.error("Status code:", error.statusCode);
      if (error.response) console.error("Response:", error.response);
    }
    
    console.log("\nNow trying with the sendPrompt function (this is what was failing):");
    try {
      const response = await sendPrompt("What is the capital of France?");
      console.log("sendPrompt response:", response);
    } catch (error) {
      console.error("sendPrompt error:", error.message);
      if (error.statusCode) console.error("Status code:", error.statusCode);
      if (error.response) console.error("Response:", error.response);
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response);
    }
    console.error("Stack:", error.stack);
  }
}

main(); 