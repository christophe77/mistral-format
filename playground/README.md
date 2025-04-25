# Mistral Format Playground

This directory contains the interactive playground for the Mistral Format library. The playground allows users to test the various formatters available in the library directly in the browser.

## Structure

- `index.html`: The main HTML file for the playground
- `js/`: JavaScript modules for the playground
  - `app.js`: Main application entry point
  - `ui.js`: UI element setup and reference management
  - `events.js`: Event handling for all UI interactions
  - `utils.js`: Utility functions for common operations
- `css/`: CSS styles for the playground
  - `styles.css`: Main stylesheet
- `dist/`: Distribution files
  - `mistral-format.min.js`: The minified Mistral Format library

## Running the Playground Locally

To run the playground locally:

1. Build the Mistral Format library:
   ```bash
   npm run build
   ```

2. Copy the built library to the playground:
   ```bash
   cp dist/mistral-format.min.js playground/dist/
   ```

3. Open the `playground/index.html` file in your browser.

## Features

The playground allows you to:

- Test all formatters (Text, Markdown, XML, SQL, and JSON) with different Mistral AI models
- See both raw and cleaned responses
- Configure advanced options like temperature, top_p, max_tokens, etc.
- Experiment with different prompts
- See the real-time output from the Mistral AI API

## Online Version

The playground is also available online at:
[https://christophe77.github.io/mistral-format/](https://christophe77.github.io/mistral-format/)

## API Key

To use the playground, you need a valid Mistral AI API key from [console.mistral.ai](https://console.mistral.ai). 