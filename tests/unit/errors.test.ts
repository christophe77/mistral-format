import { describe, it, expect } from '@jest/globals';

import {
  MistralError,
  APIError,
  ParseError,
  AuthError,
  handleError,
  safeExecute,
} from '../../src/errors';

describe('Error Module', () => {
  describe('MistralError', () => {
    it('should create a MistralError with correct name and message', () => {
      // Arrange & Act
      const errorMessage = 'Test error message';
      const error = new MistralError(errorMessage);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(MistralError);
      expect(error.name).toBe('MistralError');
      expect(error.message).toBe(errorMessage);
    });
  });

  describe('APIError', () => {
    it('should create an APIError with string response', () => {
      // Arrange & Act
      const errorMessage = 'API error occurred';
      const status = 404;
      const responseText = 'Resource not found';
      const error = new APIError(errorMessage, status, responseText);

      // Assert
      expect(error).toBeInstanceOf(MistralError);
      expect(error).toBeInstanceOf(APIError);
      expect(error.name).toBe('APIError');
      expect(error.message).toBe(errorMessage);
      expect(error.status).toBe(status);
      expect(error.response.status).toBe(status);
      expect(error.response.text).toBe(responseText);
    });

    it('should create an APIError with object response', () => {
      // Arrange & Act
      const errorMessage = 'API error occurred';
      const status = 500;
      const responseObj = { error: 'Internal server error' };
      const error = new APIError(errorMessage, status, responseObj);

      // Assert
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe(errorMessage);
      expect(error.status).toBe(status);
      expect(error.response.status).toBe(status);
      expect(error.response.text).toBe(JSON.stringify(responseObj));
    });
  });

  describe('ParseError', () => {
    it('should create a ParseError with correct name and message', () => {
      // Arrange & Act
      const errorMessage = 'Failed to parse response';
      const error = new ParseError(errorMessage);

      // Assert
      expect(error).toBeInstanceOf(MistralError);
      expect(error).toBeInstanceOf(ParseError);
      expect(error.name).toBe('ParseError');
      expect(error.message).toBe(errorMessage);
    });
  });

  describe('AuthError', () => {
    it('should create an AuthError with default message', () => {
      // Arrange & Act
      const error = new AuthError();

      // Assert
      expect(error).toBeInstanceOf(MistralError);
      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe('AuthError');
      expect(error.message).toBe('Authentication failed: API key is missing or invalid');
    });
  });

  describe('handleError', () => {
    it('should throw the original error if it is a MistralError', () => {
      // Arrange
      const mistralError = new MistralError('Original mistral error');

      // Act & Assert
      expect(() => handleError(mistralError)).toThrow(mistralError);
    });

    it('should wrap non-MistralError in a MistralError', () => {
      // Arrange
      const originalError = new Error('Some other error');

      // Act & Assert
      expect(() => handleError(originalError)).toThrow(MistralError);
      expect(() => handleError(originalError)).toThrow(
        `Unexpected error: ${originalError.message}`,
      );
    });
  });

  describe('safeExecute', () => {
    it('should return the result of the function if no error occurs', async () => {
      // Arrange
      const expected = 'success';
      const fn = jest.fn().mockResolvedValue(expected);

      // Act
      const result = await safeExecute(fn, 'Fallback message');

      // Assert
      expect(result).toBe(expected);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should re-throw MistralError without wrapping', async () => {
      // Arrange
      const originalError = new MistralError('Original mistral error');
      const fn = jest.fn().mockRejectedValue(originalError);

      // Act & Assert
      await expect(safeExecute(fn, 'Fallback message')).rejects.toThrow(originalError);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should wrap non-MistralError with fallback message', async () => {
      // Arrange
      const originalError = new Error('Some other error');
      const fallbackMessage = 'Operation failed';
      const fn = jest.fn().mockRejectedValue(originalError);

      // Act & Assert
      await expect(safeExecute(fn, fallbackMessage)).rejects.toThrow(MistralError);
      await expect(safeExecute(fn, fallbackMessage)).rejects.toThrow(fallbackMessage);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
