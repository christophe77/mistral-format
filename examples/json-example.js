// Example of JSON formatter with TypeScript type definition
// To run this example:
// 1. Set your Mistral API key as an environment variable: export MISTRAL_API_KEY=your_key_here
// 2. Run with: node examples/json-example.js
const { init, toJson } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version

    // Define a type schema for JSON formatting
    const UserType = {
      name: "";
      age: 0;
      email: "";
    }

    console.log("Running JSON formatter example with schema object...");
    // JSON Formatter Example (using schema object)
    const userInfoWithSchema = await toJson(
      "Generate information for a user named John Doe",
      {
        typeSchema: UserType,
        model: "mistral-tiny"
      }
    );
    console.log("JSON response with schema:", JSON.stringify(userInfoWithSchema, null, 2));

    console.log("\nRunning JSON formatter example with TypeScript type definition...");
    // JSON Formatter Example (using TypeScript type definition)
    // Define a TypeScript type as a string
    const userTypeDefinition = `
    interface User {
      name: string;
      age: number;
      email: string;
      isActive: boolean;
      skills: string[];
    }`;

    const userInfoWithType = await toJson(
      "Generate information for a user named Jane Smith who is an active software developer",
      {
        model: "mistral-tiny",
        typeDefinition: userTypeDefinition
      }
    );
    console.log("JSON response with TypeScript type:", JSON.stringify(userInfoWithType, null, 2));
    
    return {
      userInfoWithSchema,
      userInfoWithType
    };
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