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

- Node.js (version 14 or higher)
- npm or yarn
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/mistral-format.git
   cd mistral-format
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/mistral-format.git
   ```
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

1. Make sure you're on the `develop` branch and it's up to date:

   ```bash
   git checkout develop
   git pull upstream develop
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

1. Make sure you're on the `develop` branch and it's up to date:

   ```bash
   git checkout develop
   git pull upstream develop
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
   git pull upstream develop
   git checkout -b release/vX.Y.Z
   ```

2. Make release-specific changes (version numbers, etc.)
3. Test thoroughly
4. When ready, merge to both `main` and `develop`:

   ```bash
   git checkout main
   git merge --no-ff release/vX.Y.Z
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push upstream main --tags

   git checkout develop
   git merge --no-ff release/vX.Y.Z
   git push upstream develop
   ```

### Hotfixes

1. Create a hotfix branch from `main`:

   ```bash
   git checkout main
   git pull upstream main
   git checkout -b hotfix/vX.Y.Z-description
   ```

2. Fix the critical bug
3. When ready, merge to both `main` and `develop`:

   ```bash
   git checkout main
   git merge --no-ff hotfix/vX.Y.Z-description
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push upstream main --tags

   git checkout develop
   git merge --no-ff hotfix/vX.Y.Z-description
   git push upstream develop
   ```

## Pull Request Process

1. Update your feature branch with the latest changes from develop:

   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature
   git rebase develop
   ```

2. Make sure your code passes all tests:

   ```bash
   npm test
   ```

3. Create a pull request to merge your branch into `develop`
4. In the PR description:

   - Describe what the PR does
   - Reference any related issues
   - Include any special instructions for testing

5. Wait for code review and address any feedback
6. Once approved, your PR will be merged

## Coding Standards

- Follow the project's ESLint rules
- Use TypeScript for type safety
- Follow the existing code style and patterns
- Write descriptive variable and function names
- Keep functions small and focused on a single task
- Comment your code when necessary, but prefer self-documenting code

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

Thank you for contributing to Mistral Format!
