// Example of setting up Mistral API key with init function
const { init, sendPrompt } = require('../dist');

/**
 * This example demonstrates how to use the init function
 * to set up your Mistral API key programmatically
 */
async function main() {
  try {
    // OPTION 1: Set API key directly
    // Replace this with your actual Mistral API key
    console.log("Setting API key with init function...");
    init("your-mistral-api-key-here");
    
    // OPTION 2: Load API key from environment variable
    // This would be the alternative approach:
    // init(process.env.MISTRAL_API_KEY);
    
    console.log("Making API request...");
    const response = await sendPrompt(
      "What are three benefits of using TypeScript over JavaScript?",
      "mistral-small" // Using a smaller model for faster/cheaper response
    );
    console.log("\nResponse from Mistral AI:");
    console.log(response);
  } catch (error) {
    console.error("Error:", error.message);
    
    if (error.code === 'AUTH_ERROR' || error.statusCode === 401) {
      console.error("\nTip: Make sure to replace 'your-mistral-api-key-here' with your actual Mistral API key");
      console.error("You can get an API key at https://console.mistral.ai/");
    }
  }
}

main(); 