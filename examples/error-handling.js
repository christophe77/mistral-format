// Example of error handling
const { init, sendPrompt, MistralError, APIError } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    console.log("--- Error Handling Examples ---");
    
    try {
      // Simulate an invalid model error
      console.log("Testing error handling with invalid model...");
      await sendPrompt("This will fail", "invalid-model");
    } catch (error) {
      if (error instanceof APIError) {
        console.log(`✓ Caught API Error - Code: ${error.code}, Status: ${error.statusCode}`);
        console.log(`  Message: ${error.message}`);
      } else {
        console.log(`✓ Caught Error: ${error.message}`);
      }
    }
    
    console.log("Error handling demonstration complete");
  } catch (error) {
    if (error instanceof MistralError) {
      console.error(`Error [${error.code}]:`, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

main(); 