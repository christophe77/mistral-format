// Example of SQL formatter
const { init, toSQL, SQLDatabaseType } = require('../dist');

async function main() {
  try {
    // Initialize with API key and explicitly set to API version v1
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY, 'v1'); // Explicitly specify v1 API version
    
    // SQL Formatter Example (Default: MySQL)
    const mySqlResponse = await toSQL("Create a query to find all users who registered in the last month");
    
    // SQL Formatter Example (PostgreSQL)
    const postgresResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.POSTGRESQL
    );
    
    // SQL Formatter Example (SQL Server)
    const sqlServerResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.SQLSERVER,
      "mistral-small" // Can also specify model
    );
    
    return {
      mySqlResponse,
      postgresResponse,
      sqlServerResponse
    };
  } catch (error) {
    throw error;
  }
}

main(); 