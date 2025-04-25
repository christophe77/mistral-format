// Example of error handling
const { init, sendPrompt, MistralError, APIError } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    try {
      // Simulate an invalid model error
      await sendPrompt("This will fail", "invalid-model");
    } catch (error) {
      // Handle API errors
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
    throw error;
  }
}

main(); 