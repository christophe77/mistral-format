// Example of markdown formatter
// To run this example:
// 1. Set your Mistral API key as an environment variable: export MISTRAL_API_KEY=your_key_here
// 2. Run with: node examples/markdown-example.js
const { init, toMarkdown } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "QPXqzc2zupz8YsqqUQJLbF9eDSjAx0AL";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    console.log("Running Markdown formatter example...");
    // Markdown Formatter Example
    const markdownResponse = await toMarkdown("Write a short guide about artificial intelligence");
    console.log("\nMarkdown Response:\n");
    console.log(markdownResponse);
    
    return markdownResponse;
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