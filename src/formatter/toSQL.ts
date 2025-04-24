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
 * Options for SQL generation
 */
export interface SQLOptions {
  /** Target SQL database type */
  dbType?: SQLDatabaseType;
  /** Mistral AI model to use */
  model?: MistralModel;
  /** Additional request options */
  options?: Partial<ChatCompletionOptions>;
}

/**
 * Clean SQL response by removing extra backticks and code fence markers
 * @param text Raw response from AI
 * @returns Cleaned SQL query
 */
function cleanSqlResponse(text: string): string {
  if (!text) return '';
  
  // Remove SQL code fence if present
  let cleaned = text;
  
  // Remove leading/trailing ```sql or specific SQL type fences
  const sqlTypes = ['sql', 'mysql', 'postgresql', 'pgsql', 'sqlite', 'tsql', 'plsql', 'mariadb'];
  const sqlPattern = sqlTypes.join('|');
  const fenceRegex = new RegExp(`^\\s*\`\`\`(?:${sqlPattern})?\\s*`, 'i');
  
  cleaned = cleaned.replace(fenceRegex, '');
  cleaned = cleaned.replace(/\s*```\s*$/, '');
  
  // If still surrounded by plain backtick fences, remove them too
  if (cleaned.startsWith('`') && cleaned.endsWith('`')) {
    cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '');
  }
  
  return cleaned.trim();
}

/**
 * Generate a response in SQL format for a specific database
 * @param prompt The user's prompt
 * @param options Generation options
 * @returns Formatted SQL query string
 */
export async function toSQL(
  prompt: string, 
  options: SQLOptions = {}
): Promise<string> {
  const { dbType = SQLDatabaseType.MYSQL, model, options: requestOptions } = options;
  
  return safeExecute(async () => {
    const response = await sendSqlPrompt(prompt, dbType, model, requestOptions);
    return cleanSqlResponse(response);
  }, `Failed to generate SQL response for ${dbType}`);
}
