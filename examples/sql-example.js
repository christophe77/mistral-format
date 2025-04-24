// Example of SQL formatter
const { init, toSQL, SQLDatabaseType } = require('../dist');

async function main() {
  try {
    // Initialize with API key
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "your-api-key-here";
    init(MISTRAL_API_KEY);
    
    console.log("--- SQL Formatter Example (Default: MySQL) ---");
    const mySqlResponse = await toSQL("Create a query to find all users who registered in the last month");
    console.log("MySQL response:", mySqlResponse);
    
    console.log("\n--- SQL Formatter Example (PostgreSQL) ---");
    const postgresResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.POSTGRESQL
    );
    console.log("PostgreSQL response:", postgresResponse);
    
    console.log("\n--- SQL Formatter Example (SQL Server) ---");
    const sqlServerResponse = await toSQL(
      "Create a query to find all users who registered in the last month",
      SQLDatabaseType.SQLSERVER,
      "mistral-small" // Can also specify model
    );
    console.log("SQL Server response:", sqlServerResponse);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main(); 