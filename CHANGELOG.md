# Changelog

All notable changes to the `mistral-format` package will be documented in this file.

## [1.0.7] - 2024-12-05

### Added
- Improved browser compatibility with conditional dotenv loading
- Added browser-specific entry point for better bundle optimization
- Created separate webpack configurations for Node.js and browser environments
- Added bundle analyzer for identifying large dependencies

### Fixed
- Fixed package.json import warning in webpack builds
- Reduced bundle size by optimizing imports for browser environments
- Updated TypeScript configuration to use NodeNext module resolution
- Fixed bundling conflicts by restructuring output directories

## [1.0.6] - 2024-11-30

### Added
- Implemented automatic rate limiting system to prevent 429 errors
- Added configurable retry mechanism with exponential backoff
- Added new `configureRateLimiter()` function for customizing rate limits
- Added `RateLimiter` class for advanced rate limiting control
- New example: `examples/rate-limiter-example.js`

### Improved
- Enhanced test coverage across all modules
- Optimized API request handling with queuing mechanism
- Better error handling for rate limit exceeded scenarios
- Updated README with rate limiting documentation

## [1.0.5] - 2024-11-25

### Fixed
- Fixed critical bug where the client was using library version number as API version
- Updated all examples to explicitly specify API version 'v1'
- Resolved 404 errors by ensuring consistent API version usage across the library
- Fixed README documentation to correctly state that the default API version is 'v1'

## [1.0.4] - 2024-11-24

### Fixed
- Corrected the Mistral API endpoint URL to use the correct format: `https://api.mistral.ai/v1/chat/completions`
- Updated default API version to `v1` (from `v2`) to align with Mistral's documentation
- Fixed error handling for API responses
- Added clear error messages for authentication issues

### Added
- New verification script (`examples/verify-config.js`) to help troubleshoot API connection issues
- Added detailed documentation for API configuration in README
- Added troubleshooting section to README.md
- Added proper export for `getVersionInfo` function to check library and API versions

## [1.0.3] - 2024-11-23

### Added
- Added default export to support both named imports and importing as a single object
- Improved TypeScript typing for the default export object
- Updated README with proper import patterns

## [1.0.2] - Initial Release

- Initial public release of mistral-format library
- Support for various Mistral AI models
- Formatters for JSON, XML, Markdown, and SQL outputs
- Automatic response cleaning and formatting
- Type-safe API with robust error handling 