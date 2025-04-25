// Example of XML formatter
const { init, toXml } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    console.log("--- XML Formatter Example ---");
    const xmlResponse = await toXml("List three programming languages and their key features", "mistral-small");
    console.log("XML response:", xmlResponse);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main(); 