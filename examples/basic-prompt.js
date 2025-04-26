// Example of basic prompt
// To run this example:
// 1. Set your Mistral API key as an environment variable: export MISTRAL_API_KEY=your_key_here
// 2. Run with: node examples/basic-prompt.js
const { init, sendPrompt, getVersionInfo } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    // Now trying with the sendPrompt function
    const response = await sendPrompt("What is the capital of France?");
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error.message);
    if (error.status) console.error("Status Code:", error.status);
    if (error.response) console.error("API Response:", error.response.text);
    throw error;
  }
}

// When run directly, execute the main function
if (require.main === module) {
  main().catch(err => {
    process.exit(1);
  });
} else {
  // When imported as a module, just export the function
  module.exports = main;
} 