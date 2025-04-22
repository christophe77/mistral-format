// Example of using the mistral connector
const { 
  init, 
  sendPrompt, 
  toMarkdown, 
  toXml, 
  toSQL,
  SQLDatabaseType,
  MistralError, 
  APIError, 
  ParseError 
} = require('./dist');

// Define a type schema for JSON formatting
class UserType {
  constructor() {
    this.name = "";
    this.age = 0;
    this.email = "";
  }
}

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Demo error handling
async function demonstrateErrorHandling() {
  console.log("\n--- Error Handling Examples ---");
  
  try {
    // Simulate an invalid model error
    console.log("Testing error handling with invalid model...");
    await sendPrompt("This will fail", "invalid-model");
  } catch (error) {
    if (error instanceof APIError) {
      console.log(`✓ Caught API Error - Code: ${error.code}, Status: ${error.statusCode}`);
      console.log(`  Message: ${error.message}`);
    } else {
      console.log(`✓ Caught Error: ${error.message}`);
    }
  }
  
  console.log("Error handling demonstration complete");
}

async function main() {
  try {
    // Initialize the library with your API key
    // You can either:
    // 1. Get the API key from .env file (already implemented)
    // 2. Set it programmatically like this:
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    console.log("Initializing with API key...");
    init(MISTRAL_API_KEY);
    console.log("Initialization complete!");
    
    console.log("\n--- Basic Prompt Example (default model: mistral-medium) ---");
    const response = await sendPrompt("What is the capital of France?");
    console.log("Mistral AI response:", response);
    
    // Wait 3 seconds between API calls
    console.log("\nWaiting 3 seconds to avoid rate limits...");
    await delay(3000);
    
    console.log("\n--- Markdown Formatter Example ---");
    const markdownResponse = await toMarkdown("Write a short guide about artificial intelligence");
    console.log("Markdown response:", markdownResponse);
    
    // Wait 3 seconds between API calls
    console.log("\nWaiting 3 seconds to avoid rate limits...");
    await delay(3000);
    
    console.log("\n--- XML Formatter Example ---");
    const xmlResponse = await toXml("List three programming languages and their key features", "mistral-small");
    console.log("XML response:", xmlResponse);
    
    // Wait 3 seconds between API calls
    console.log("\nWaiting 3 seconds to avoid rate limits...");
    await delay(3000);
    
    console.log("\n--- SQL Formatter Example (Default: MySQL) ---");
    const mySqlResponse = await toSQL("Create a query to find all users who registered in the last month");
    console.log("MySQL response:", mySqlResponse);
    
    // Wait 3 seconds between API calls
    console.log("\nWaiting 3 seconds to avoid rate limits...");
    await delay(3000);
    
    console.log("\n--- SQL Formatter Example (PostgreSQL) ---");
    const postgresResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.POSTGRESQL
    );
    console.log("PostgreSQL response:", postgresResponse);
    
    // Wait 3 seconds between API calls
    console.log("\nWaiting 3 seconds to avoid rate limits...");
    await delay(3000);
    
    console.log("\n--- SQL Formatter Example (SQL Server) ---");
    const sqlServerResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.SQLSERVER,
      "mistral-small" // Can also specify model
    );
    console.log("SQL Server response:", sqlServerResponse);
    
    // Wait 3 seconds between API calls
    console.log("\nWaiting 3 seconds to avoid rate limits...");
    await delay(3000);
    
    console.log("\n--- JSON Formatter Example ---");
    const { toJson } = require('./dist');
    const userInfo = await toJson("Generate information for a user named John Doe", UserType, "mistral-tiny");
    console.log("JSON response (parsed):", userInfo);
    
    // Wait 3 seconds before error handling demo
    console.log("\nWaiting 3 seconds to avoid rate limits...");
    await delay(3000);
    
    // Demonstrate error handling
    await demonstrateErrorHandling();
  } catch (error) {
    if (error instanceof MistralError) {
      console.error(`Error [${error.code}]:`, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

main();