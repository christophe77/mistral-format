# Contributing to Mistral Format

Thank you for your interest in contributing to Mistral Format! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Git Flow](#git-flow)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and inclusive environment.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub by clicking the "Fork" button at the top right of the repository page.

2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR-USERNAME/mistral-format.git
   cd mistral-format
   ```

3. Add the original repository as "upstream" (this is for syncing with the original project):

   ```bash
   # Replace ORIGINAL-OWNER with the actual owner of the repository
   git remote add upstream https://github.com/ORIGINAL-OWNER/mistral-format.git

   # Verify the remote was added correctly
   git remote -v
   # You should see both 'origin' (your fork) and 'upstream' (original repo)
   ```

   If you're not sure what the original repository URL is, check the GitHub page of the project.

4. Install dependencies:
   ```bash
   npm install
   ```

## Git Flow

We follow a simplified Git Flow workflow:

### Main Branches

- `main`: Production-ready code. All releases are made from this branch.
- `develop`: Main development branch. Features and bugfixes are merged here.

### Supporting Branches

- `feature/*`: For new features
- `bugfix/*`: For bug fixes
- `release/*`: For preparing releases
- `hotfix/*`: For critical fixes to production code

### Branch Naming Convention

Branches should be named using the following format:

- `feature/short-description`
- `bugfix/issue-number-short-description`
- `release/vX.Y.Z`
- `hotfix/vX.Y.Z-short-description`

### Visual Guide to Git Flow

```
    ┌─────── hotfix/v1.0.1 ─────┐
    │                           ↓
    │      ┌─── release/v1.0.0 ──┐     ┌─── release/v1.1.0 ───┐
    │      │                    ↓      │                      ↓
main ──────┼────────────────────●──────┼──────────────────────●───
           │                           │
develop ───●───────────────────────────●──────────────────────●───
    ↑      ↑                           ↑                      ↑
    │      │                           │                      │
    │      │                           │                      │
feature/a  │                      feature/c             feature/d
           │
      feature/b
```

## Development Process

### Starting a New Feature

1. Make sure your local repository is up to date:

   ```bash
   # Switch to the develop branch
   git checkout develop

   # Update your local develop branch from your fork
   git pull origin develop

   # Update from the original repository (if set up)
   git pull upstream develop
   # If you get an error about 'upstream', you may need to set it up first:
   # git remote add upstream https://github.com/ORIGINAL-OWNER/mistral-format.git
   ```

2. Create a new feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes, commit them with clear messages:

   ```bash
   git add .
   git commit -m "Add your clear message here"
   ```

4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

### Fixing a Bug

1. Make sure your local repository is up to date:

   ```bash
   # Switch to the develop branch
   git checkout develop

   # Update from your fork and the original repository
   git pull origin develop
   git pull upstream develop  # Skip if you haven't set up upstream
   ```

2. Create a new bugfix branch:

   ```bash
   git checkout -b bugfix/issue-number-description
   ```

3. Fix the bug, commit with clear message:

   ```bash
   git add .
   git commit -m "Fix issue #123: Short description"
   ```

4. Push your branch to your fork:
   ```bash
   git push origin bugfix/issue-number-description
   ```

### Creating a Release

1. From `develop`, create a release branch:

   ```bash
   git checkout develop
   git pull origin develop
   git pull upstream develop  # Skip if you haven't set up upstream
   git checkout -b release/vX.Y.Z
   ```

2. Make release-specific changes (version numbers, etc.)
3. Test thoroughly
4. When ready, merge to both `main` and `develop`:

   ```bash
   git checkout main
   git merge --no-ff release/vX.Y.Z
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin main --tags

   git checkout develop
   git merge --no-ff release/vX.Y.Z
   git push origin develop
   ```

   Note: Only project maintainers should push directly to the main repository.

### Hotfixes

1. Create a hotfix branch from `main`:

   ```bash
   git checkout main
   git pull origin main
   git pull upstream main  # Skip if you haven't set up upstream
   git checkout -b hotfix/vX.Y.Z-description
   ```

2. Fix the critical bug
3. When ready, merge to both `main` and `develop`:

   ```bash
   git checkout main
   git merge --no-ff hotfix/vX.Y.Z-description
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin main --tags

   git checkout develop
   git merge --no-ff hotfix/vX.Y.Z-description
   git push origin develop
   ```

## Pull Request Process

1. Update your feature branch with the latest changes from develop:

   ```bash
   git checkout develop
   git pull origin develop
   git pull upstream develop  # Skip if you haven't set up upstream
   git checkout feature/your-feature
   git rebase develop
   ```

2. Make sure your code passes all tests:

   ```bash
   npm test
   ```

3. Create a pull request to merge your branch into `develop`:

   - Go to the original repository on GitHub
   - Click "Pull requests" and then "New pull request"
   - Click "compare across forks"
   - Set the base repository to the original repo, branch "develop"
   - Set the head repository to your fork, and your feature branch
   - Click "Create pull request"

4. In the PR description:

   - Describe what the PR does
   - Reference any related issues
   - Include any special instructions for testing

5. Wait for code review and address any feedback
6. Once approved, your PR will be merged

## Coding Standards

- Follow the project's ESLint rules
  ```bash
  # Check for linting issues
  npm run lint
  
  # Automatically fix linting issues where possible
  npm run lint:fix
  ```

- Use Prettier for code formatting
  ```bash
  # Format all TypeScript files
  npm run format
  
  # Check if files are properly formatted
  npm run format:check
  ```

- Use TypeScript for type safety
- Follow the existing code style and patterns
- Write descriptive variable and function names
- Keep functions small and focused on a single task
- Comment your code when necessary, but prefer self-documenting code

### Code Style Guidelines

1. **Naming Conventions**
   - Use camelCase for variables, functions, and method names
   - Use PascalCase for class names, interfaces, and type names
   - Use UPPER_SNAKE_CASE for constants
   - Prefixing interface names with `I` is discouraged

2. **TypeScript Best Practices**
   - Avoid `any` types when possible
   - Use explicit return types for functions
   - Prefer interfaces over type aliases for object shapes
   - Use optional parameters instead of multiple function signatures when appropriate

3. **Import Order**
   - Built-in Node.js modules first
   - External modules (from node_modules)
   - Internal modules (local imports)
   - Relative imports

4. **Code Organization**
   - Keep files focused on a single responsibility
   - Limit file size to 300-400 lines maximum (prefer more, smaller files)
   - Group related functions and classes together

### Visual Studio Code Setup

We recommend using Visual Studio Code with the following extensions:

- ESLint: `dbaeumer.vscode-eslint`
- Prettier: `esbenp.prettier-vscode`
- TypeScript ESLint: `ms-vscode.vscode-typescript-tslint-plugin`

The repository includes VSCode settings in `.vscode/settings.json` that will automatically format code on save and run ESLint fixes.

## Testing

- All code should have appropriate tests
- Maintain or improve code coverage
- Run tests before submitting a PR:
  ```bash
  npm test
  ```

## Documentation

- Update documentation for any new features or changes
- Document APIs with JSDoc comments
- Keep the README updated

## Adding a New Formatter

When adding a new formatter to the project, please follow these steps:

1. Implement the formatter following the existing patterns in the codebase
2. Add appropriate tests for your formatter
3. Update the `/tests/playground/index.html` file to include a test section for your new formatter
   - Follow the existing pattern of other formatters in the file
   - Add appropriate form controls, model selection, and result display areas
   - Include the JavaScript code to connect your formatter to the UI
4. Update the documentation to reflect the new formatter
5. Include an example usage in the README.md

## Building the Library

The project uses both TypeScript compiler and Webpack for building different distribution formats:

1. **TypeScript Build**: Generates ESM modules for Node.js usage
   ```bash
   npm run build:tsc
   ```

2. **Webpack Build**: Generates UMD bundles for browser usage
   ```bash
   npm run build:webpack
   ```

3. **Complete Build**: Runs both TypeScript and Webpack builds
   ```bash
   npm run build
   ```

The build process creates the following files:
- `dist/index.js` - The main ESM module entry point
- `dist/index.d.ts` - TypeScript type definitions
- `dist/mistral-format.min.js` - Minified UMD bundle for browser usage

When adding a new formatter, make sure it's properly exported in `src/index.ts` to be available in both the Node.js and browser bundles.

## Playground Deployment

The project includes an interactive playground hosted on GitHub Pages at [https://christophe77.github.io/mistral-format/](https://christophe77.github.io/mistral-format/).

The playground is automatically deployed when changes are pushed to the main branch. The deployment process:

1. Builds the project
2. Deploys the playground HTML with the latest library build

If you're making changes to formatters or adding new ones, please test them in the playground before submitting a PR to ensure they work correctly in a browser environment.

Thank you for contributing to Mistral Format!
