// Example of markdown formatter
const { init, toMarkdown } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    // Markdown Formatter Example
    const markdownResponse = await toMarkdown("Write a short guide about artificial intelligence");
    return markdownResponse;
  } catch (error) {
    throw error;
  }
}

main(); 