// Verification script for Mistral API
// This script verifies that your API key and configuration are correct
const { init, sendPrompt, getVersionInfo } = require('../dist');

// Get API key from command line argument or .env file
const API_KEY = process.argv[2] || process.env.MISTRAL_API_KEY;

if (!API_KEY) {
  console.error("⚠️ Error: No API key provided");
  console.error("Please either:");
  console.error("1. Pass your API key as a command line argument: node examples/verify-config.js YOUR_API_KEY");
  console.error("2. Set your API key in a .env file: MISTRAL_API_KEY=your_api_key_here");
  process.exit(1);
}

async function main() {
  try {
    console.log("🔍 Verifying Mistral API configuration...\n");
    
    // Initialize with API key (using v1 as per documentation)
    console.log("✓ Initializing with API key");
    init(API_KEY, 'v1');
    
    // Display version information
    const versionInfo = getVersionInfo();
    console.log(`✓ Library version: ${versionInfo.libraryVersion}`);
    console.log(`✓ API version: ${versionInfo.apiVersion}`);
    
    // Send a simple test prompt
    console.log("\n🚀 Testing API connection with a simple prompt...");
    console.log("  Prompt: What is the capital of France?");
    console.log("  Model: mistral-medium (default)");
    console.log("  Sending request...");
    
    const response = await sendPrompt("What is the capital of France?");
    console.log("\n✅ Success! API connection working properly");
    console.log("Response from Mistral AI:");
    console.log(`"${response}"`);
    
  } catch (error) {
    console.error("\n❌ Error connecting to Mistral API:");
    console.error(`   ${error.message}`);
    
    if (error.response) {
      console.error("\nAPI Response:");
      console.error(error.response);
    }
    
    console.error("\nTroubleshooting tips:");
    console.error("1. Check that your API key is correct and active at console.mistral.ai");
    console.error("2. Ensure you have an active payment method set up in your Mistral account");
    console.error("3. Verify your internet connection and any proxies that might block API requests");
    process.exit(1);
  }
}

main(); 