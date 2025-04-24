# Mistral Format

A simple and powerful TypeScript library for interacting with the Mistral AI API. It works seamlessly in both browser and Node.js environments, providing strongly-typed responses and formatters for common output formats.

## Features

- 🚀 **Simple, Promise-based API** - Easy to use with async/await
- 🔄 **Multiple Response Formats** - JSON, Markdown, XML, SQL, and raw text
- 🧠 **Advanced Type Support** - TypeScript interfaces and schema validation
- 🌐 **Cross-Platform** - Works in both Node.js and browser environments
- 🧩 **Modular Design** - Import only what you need
- 🔒 **Error Handling** - Comprehensive error types and safe execution
- 🛠️ **Configurable** - Customize with options objects
- 🧹 **Auto-Cleaning** - Automatically removes code fences and formatting artifacts

## Live Playground

Try Mistral Format directly in your browser with our interactive playground:

[**🚀 Launch the Mistral Format Playground**](https://christophe77.github.io/mistral-format/)

The playground allows you to:

- Test all formatters with different Mistral AI models
- See both raw and cleaned responses
- Experiment with different prompts
- Compare results across formats

You'll need your own Mistral API key to use the playground.

## Installation

```bash
npm install mistral-format
```

## Setup

You have two options for setting up your Mistral API key:

### Option 1: Using `.env` file

Create a `.env` file in your project root with your Mistral API key:

```
MISTRAL_API_KEY=your_api_key_here
```

### Option 2: Initialize programmatically

You can also set your API key programmatically:

```javascript
const { init } = require('mistral-format');

// Initialize with your API key
init('your-api-key-here');

// You can also specify the API version (default is 'v1')
init('your-api-key-here', 'v2');
```

This is especially useful for:

- Dynamic API key management
- Environments where `.env` files aren't practical
- Browser applications where you might get the key from a secure backend
- Testing against different API versions

## Usage

### Basic Prompt

```javascript
const { init, sendPrompt } = require('mistral-format');

async function main() {
	try {
		// Optional: Set API key programmatically (alternative to .env file)
		init('your-api-key-here');

		// Default model is "mistral-medium"
		const response = await sendPrompt('What is the capital of France?');
		console.log('Mistral AI response:', response);

		// You can specify a different model
		const smallModelResponse = await sendPrompt(
			'What is the capital of Germany?',
			'mistral-small',
		);
		console.log('Small model response:', smallModelResponse);
	} catch (error) {
		console.error('Error:', error.message);
	}
}

main();
```

### Supported Models

The package supports the following Mistral AI models:

- `mistral-tiny` - Fastest, most economical model
- `mistral-small` - Good balance of speed and quality
- `mistral-medium` - Default model with excellent quality
- `mistral-large` - Most advanced model, best quality

## Formatters

The library includes several formatters to get responses in specific formats. All formatters now use a consistent options object pattern for better flexibility.

### Automatic Response Cleaning

All formatters automatically clean the AI responses by removing code fences, language markers, and extraneous backticks. This means:

- No more dealing with `` ```json ``, `` ```sql `` or other language markers
- No need to manually strip code blocks from responses
- No backticks or formatting noise in your strings

For example, if the AI returns:

```
```sql
SELECT * FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH);
```
```

Your code receives just:

```
SELECT * FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH);
```

This works for all formatters (JSON, Markdown, XML, SQL) automatically.

### Markdown

```javascript
const { toMarkdown } = require('mistral-format');

// Basic usage with default options
const markdownResponse = await toMarkdown('Write a short guide about AI');

// With options object
const customMarkdown = await toMarkdown('Write a short guide about AI', {
	model: 'mistral-large',
	options: {
		temperature: 0.7,
		max_tokens: 500
	}
});

console.log(customMarkdown);
```

### XML

```javascript
const { toXml } = require('mistral-format');

// Basic usage with default options
const xmlResponse = await toXml('List three programming languages');

// With options object
const customXml = await toXml('List three programming languages', {
	model: 'mistral-small',
	options: {
		temperature: 0.5
	}
});

console.log(customXml);
```

### SQL

```javascript
const { toSQL, SQLDatabaseType } = require('mistral-format');

// Default database type (MySQL)
const mySqlResponse = await toSQL('Create a query to find all users');

// With options object
const postgresResponse = await toSQL('Create a query to find all users', {
	dbType: SQLDatabaseType.POSTGRESQL,
	model: 'mistral-medium',
	options: {
		temperature: 0.3
	}
});

console.log(postgresResponse);
```

#### Supported Database Types

The `SQLDatabaseType` enum supports the following database types:

- `MYSQL` - MySQL syntax
- `POSTGRESQL` - PostgreSQL syntax
- `SQLSERVER` - Microsoft SQL Server syntax
- `ORACLE` - Oracle Database syntax
- `SQLITE` - SQLite syntax
- `MARIADB` - MariaDB syntax
- `BIGQUERY` - Google BigQuery syntax
- `SNOWFLAKE` - Snowflake syntax
- `REDSHIFT` - Amazon Redshift syntax

### JSON

```javascript
const { toJson } = require('mistral-format');

// Example 1: Using a class schema
class UserType {
	constructor() {
		this.name = '';
		this.age = 0;
		this.email = '';
	}
}

// With options object
const userInfo = await toJson('Generate info for user John Doe', {
	typeSchema: UserType,
	model: 'mistral-small'
});
console.log(userInfo); // Typed object with name, age, and email

// Example 2: Using a TypeScript type definition (as string)
const typeDefinition = `
interface User {
	name: string;
	age: number;
	email: string;
	isActive: boolean;
	skills: string[];
}`;

const developerInfo = await toJson(
	'Generate info for an active software developer',
	{
		typeDefinition: typeDefinition,
		model: 'mistral-medium',
		options: {
			temperature: 0.7
		}
	}
);
console.log(developerInfo);

// Example 3: Using a JSON schema object
const schema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		age: { type: 'number' },
		email: { type: 'string' }
	}
};

const schemaUserInfo = await toJson('Generate info for user Jane Smith', {
	schema: schema,
	model: 'mistral-tiny'
});
console.log(schemaUserInfo);
```

The `JsonOptions` interface supports the following properties:

- `typeSchema` - Class constructor for the expected response type
- `typeDefinition` - TypeScript type definition as a string
- `schema` - JSON schema object
- `model` - Mistral AI model to use
- `options` - Additional request options like temperature, top_p, etc.

## Error Handling

The package includes a comprehensive error handling system with custom error types:

```javascript
const {
	sendPrompt,
	MistralError,
	APIError,
	ParseError,
	AuthError
} = require('mistral-format');

async function main() {
	try {
		const response = await sendPrompt('What is the capital of France?');
		console.log(response);
	} catch (error) {
		// Handle specific error types
		if (error instanceof APIError) {
			console.error(`API Error (${error.statusCode}): ${error.message}`);
		} else if (error instanceof ParseError) {
			console.error(`Parse Error: ${error.message}`);
		} else if (error instanceof AuthError) {
			console.error(`Authentication Error: ${error.message}`);
		} else if (error instanceof MistralError) {
			// Handle any other Mistral-specific error
			console.error(`Mistral Error (${error.code}): ${error.message}`);
		} else {
			// Handle unexpected errors
			console.error('Unexpected error:', error);
		}
	}
}
```

### Error Types

- `MistralError` - Base error class for all application errors
- `APIError` - Error related to API calls (includes status code and response)
- `ParseError` - Error related to parsing responses (includes original content)
- `AuthError` - Error related to authentication (missing or invalid API key)

## Browser Usage

For browser usage, you have two options for providing the API key:

### Option 1: Using Webpack and .env (Build Time)

The package uses Webpack to automatically include environment variables from your `.env` file during the build process:

```javascript
import { sendPrompt } from 'mistral-format';

// API key is included in the bundle at build time
async function handleClick() {
	try {
		const response = await sendPrompt(
			'What is the capital of France?',
			'mistral-small'
		);
		document.getElementById('response').textContent = response;
	} catch (error) {
		// Handle errors
	}
}
```

### Option 2: Runtime Initialization (More Secure)

For better security, fetch the API key from your backend and initialize at runtime:

```javascript
import { init, sendPrompt, MistralError } from 'mistral-format';

async function setupAndUse() {
	try {
		// Get API key from your secure backend
		const response = await fetch('/api/get-mistral-key');
		const { apiKey } = await response.json();

		// Initialize the library with the API key
		init(apiKey);

		// Now use the library
		const result = await sendPrompt('What is the capital of France?');
		document.getElementById('result').textContent = result;
	} catch (error) {
		if (error instanceof MistralError) {
			console.error(`${error.code}: ${error.message}`);
		}
	}
}
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the package: `npm run build`
4. Run tests: `npm test`
5. Lint code: `npm run lint`
6. Format code: `npm run format`

## License

MIT
