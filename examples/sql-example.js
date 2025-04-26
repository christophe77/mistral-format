// Example of SQL formatter
// To run this example:
// 1. Set your Mistral API key as an environment variable: export MISTRAL_API_KEY=your_key_here
// 2. Run with: node examples/sql-example.js
const { init, toSQL, SQLDatabaseType } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    console.log("Running SQL formatter example (MySQL)...");
    // SQL Formatter Example (Default: MySQL)
    const mySqlResponse = await toSQL("Create a query to find all users who registered in the last month");
    console.log("\nMySQL Response:");
    console.log(mySqlResponse);
    
    console.log("\nRunning SQL formatter example (PostgreSQL)...");
    // SQL Formatter Example (PostgreSQL)
    const postgresResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.POSTGRESQL
    );
    console.log("\nPostgreSQL Response:");
    console.log(postgresResponse);
    
    console.log("\nRunning SQL formatter example (SQL Server)...");
    // SQL Formatter Example (SQL Server)
    const sqlServerResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.SQLSERVER,
      "mistral-small" // Can also specify model
    );
    console.log("\nSQL Server Response:");
    console.log(sqlServerResponse);
    
    return {
      mySqlResponse,
      postgresResponse,
      sqlServerResponse
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