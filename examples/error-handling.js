// Example of error handling
// To run this example:
// 1. Set your Mistral API key as an environment variable: export MISTRAL_API_KEY=your_key_here
// 2. Run with: node examples/error-handling.js
const { init, sendPrompt, MistralError, APIError } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    try {
      // Simulate an invalid model error
      console.log("Testing error handling with invalid model...");
      await sendPrompt("This will fail", "invalid-model");
    } catch (error) {
      // Handle API errors
      console.log(`Caught Error - Type: ${error instanceof APIError ? 'APIError' : 'Other'}`);
      console.log(`Message: ${error.message}`);
      
      return {
        caught: true,
        isApiError: error instanceof APIError,
        message: error.message,
        code: error instanceof APIError ? error.code : null,
        statusCode: error instanceof APIError ? error.statusCode : null
      };
    }
    
    return { caught: false };
  } catch (error) {
    console.error("Unexpected error:", error.message);
    throw error;
  }
}

// When run directly, execute the main function
if (require.main === module) {
  main()
    .then(result => console.log("Result:", JSON.stringify(result, null, 2)))
    .catch(err => {
      process.exit(1);
    });
} else {
  // When imported as a module, just export the function
  module.exports = main;
} 