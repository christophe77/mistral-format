// Example of basic prompt
const { init, sendPrompt } = require('../dist');

async function main() {
  try {
    // Initialize with API key and optional API version
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Specify API version (default is 'v1')
    
    console.log("--- Basic Prompt Example (default model: mistral-medium) ---");
    const response = await sendPrompt("What is the capital of France?");
    console.log("Mistral AI response:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main(); 