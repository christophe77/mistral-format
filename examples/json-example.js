// Example of JSON formatter with TypeScript type definition
const { init, toJson } = require('../dist');

async function main() {
  try {
    // Initialize with API key
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY);

    // Define a type schema for JSON formatting
    const UserType = {
      name: "";
      age: 0;
      email: "";
    }

    console.log("--- JSON Formatter Example (using schema object) ---");
    const userInfoWithSchema = await toJson(
      "Generate information for a user named John Doe",
      {
        typeSchema: UserType,
        model: "mistral-tiny"
      }
    );
    console.log("JSON response with schema (parsed):", userInfoWithSchema);

    console.log("\n--- JSON Formatter Example (using TypeScript type definition) ---");
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
    console.log("JSON response with TypeScript type (parsed):", userInfoWithType);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main(); 