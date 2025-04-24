// Example of XML formatter
const { init, toXml } = require('../dist');

async function main() {
  try {
    // Initialize with API key
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY);
    
    console.log("--- XML Formatter Example ---");
    const xmlResponse = await toXml("List three programming languages and their key features", "mistral-small");
    console.log("XML response:", xmlResponse);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main(); 