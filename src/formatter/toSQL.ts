import { sendSqlPrompt } from '../client';
import { safeExecute } from '../errors';
import { ChatCompletionOptions, MistralModel } from '../types';

/**
 * Supported SQL database types
 */
export enum SQLDatabaseType {
  MYSQL = 'MySQL',
  POSTGRESQL = 'PostgreSQL',
  SQLSERVER = 'SQL Server',
  ORACLE = 'Oracle',
  SQLITE = 'SQLite',
  MARIADB = 'MariaDB',
  BIGQUERY = 'BigQuery',
  SNOWFLAKE = 'Snowflake',
  REDSHIFT = 'Redshift'
}

/**
 * Generate a response in SQL format for a specific database
 * @param prompt The user's prompt
 * @param dbType Target SQL database type
 * @param model Optional Mistral AI model to use
 * @param options Additional request options
 * @returns Formatted SQL query string
 */
export async function toSQL(
  prompt: string, 
  dbType: SQLDatabaseType = SQLDatabaseType.MYSQL,
  model?: MistralModel,
  options?: Partial<ChatCompletionOptions>
): Promise<string> {
  return safeExecute(async () => {
    return await sendSqlPrompt(prompt, dbType, model, options);
  }, `Failed to generate SQL response for ${dbType}`);
}
