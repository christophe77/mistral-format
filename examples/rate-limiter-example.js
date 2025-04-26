// Example of rate limiter usage to prevent 429 errors
// To run this example:
// 1. Set your Mistral API key as an environment variable: export MISTRAL_API_KEY=your_key_here
// 2. Run with: node examples/rate-limiter-example.js
const { init, sendPrompt, configureRateLimiter } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "YOUR_API_KEY_HERE";
    init(MISTRAL_API_KEY, 'v1');

    // Configure the rate limiter with custom settings
    // This is optional - the library uses reasonable defaults
    configureRateLimiter({
      maxRequestsPerMinute: 30, // Lower than the default 60
      maxRetries: 3,            // Try 3 times before giving up
      initialBackoff: 1000,     // Start with 1 second backoff
      maxBackoff: 30000,        // Maximum 30 seconds backoff
      backoffMultiplier: 2      // Double the backoff time after each retry
    });

    console.log("Sending multiple requests with rate limiting...");
    
    // Send multiple requests in parallel - normally this might cause 429 errors,
    // but the rate limiter will handle it automatically
    const promises = [];
    for (let i = 0; i < 10; i++) {
      const prompt = `Give me a short fact about the number ${i}`;
      promises.push(
        sendPrompt(prompt, "mistral-tiny")
          .then(response => {
            console.log(`Response ${i}:`, response.substring(0, 50) + "...");
            return response;
          })
      );
    }

    // Wait for all requests to complete
    const results = await Promise.all(promises);
    console.log(`All ${results.length} requests completed successfully!`);
    
    return results;
  } catch (error) {
    console.error("Error:", error.message);
    if (error.status) console.error("Status Code:", error.status);
    if (error.response) console.error("API Response:", error.response.text);
  }
}

// When run directly, execute the main function
if (require.main === module) {
  main().catch(err => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });
} else {
  // When imported as a module, just export the function
  module.exports = main;
} 