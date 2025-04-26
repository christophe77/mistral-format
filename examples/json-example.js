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

    console.log("Running JSON formatter example with class schema...");
    // Example 1: Using a class schema
    class UserType {
      constructor() {
        this.name = '';
        this.age = 0;
        this.email = '';
      }
    }

    let userInfoWithClassSchema;
    try {
      userInfoWithClassSchema = await toJson(
        "Generate information for a user named John Doe who is 45 years old",
        {
          typeSchema: UserType,
          model: "mistral-small"
        }
      );
      console.log("JSON response with class schema:", userInfoWithClassSchema);
    } catch (error) {
      console.error("Class schema example error:", error);
    }

    console.log("\nRunning JSON formatter example with JSON schema...");
    // Example 2: Using a JSON schema object
    const userSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string' }
      }
    };

    let userInfoWithSchema;
    try {
      userInfoWithSchema = await toJson(
        "Generate information for a user named Mark Wilson who is 38 years old",
        {
          schema: userSchema,
          model: "mistral-small"
        }
      );
      console.log("JSON response with schema:", userInfoWithSchema);
    } catch (error) {
      console.error("Schema example error:", error);
    }

    console.log("\nRunning JSON formatter example with TypeScript type definition...");
    // Example 3: Using a TypeScript type definition
    const userTypeDefinition = `
    interface User {
      name: string;
      age: number;
      email: string;
      isActive: boolean;
      skills: string[];
    }`;

    let userInfoWithType;
    try {
      userInfoWithType = await toJson(
        "Generate information for a user named Jane Smith who is an active software developer",
        {
          model: "mistral-tiny",
          typeDefinition: userTypeDefinition
        }
      );
      console.log("JSON response with TypeScript type:", JSON.stringify(userInfoWithType, null, 2));
    } catch (error) {
      console.error("Type definition example error:", error);
    }
    
    return {
      userInfoWithClassSchema,
      userInfoWithSchema,
      userInfoWithType
    };
    
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