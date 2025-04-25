// Example of JSON formatter with TypeScript type definition
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

    // JSON Formatter Example (using schema object)
    const userInfoWithSchema = await toJson(
      "Generate information for a user named John Doe",
      {
        typeSchema: UserType,
        model: "mistral-tiny"
      }
    );

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
    
    return {
      userInfoWithSchema,
      userInfoWithType
    };
  } catch (error) {
    throw error;
  }
}

main(); 