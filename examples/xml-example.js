// Example of XML formatter
// To run this example:
// 1. Set your Mistral API key as an environment variable: export MISTRAL_API_KEY=your_key_here
// 2. Run with: node examples/xml-example.js
const { init, toXml } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    console.log("Running XML formatter example...");
    // XML Formatter Example
    const xmlResponse = await toXml("List three programming languages and their key features", "mistral-small");
    console.log("\nXML Response:\n");
    console.log(xmlResponse);
    
    return xmlResponse;
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