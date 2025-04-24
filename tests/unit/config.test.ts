import { init, getApiKey, getApiVersion } from '../../src/config';

describe('Config Module', () => {
  // Save the original environment
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment for each test
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.MISTRAL_API_KEY;
  });

  afterAll(() => {
    // Restore the original environment
    process.env = originalEnv;
  });

  describe('init()', () => {
    it('should set the API key', () => {
      // Arrange
      const apiKey = 'test-api-key';
      
      // Act
      init(apiKey);
      
      // Assert
      expect(getApiKey()).toBe(apiKey);
    });

    it('should set the API version when provided', () => {
      // Arrange
      const apiKey = 'test-api-key';
      const apiVersion = 'v2';
      
      // Act
      init(apiKey, apiVersion);
      
      // Assert
      expect(getApiVersion()).toBe(apiVersion);
    });

    it('should use the default API version when not provided', () => {
      // Arrange
      const apiKey = 'test-api-key';
      
      // Act
      init(apiKey);
      
      // Assert
      expect(getApiVersion()).toBe('v1');
    });
  });

  describe('getApiKey()', () => {
    it('should return API key from init when set', () => {
      // Arrange
      const apiKey = 'test-api-key';
      init(apiKey);
      
      // Act & Assert
      expect(getApiKey()).toBe(apiKey);
    });

    it('should return API key from environment when not set via init', () => {
      // Arrange
      const envApiKey = 'env-api-key';
      process.env.MISTRAL_API_KEY = envApiKey;
      
      // Act & Assert
      expect(getApiKey()).toBe(envApiKey);
    });

    it('should return empty string when API key not set anywhere', () => {
      // Act & Assert
      expect(getApiKey()).toBe('');
    });
  });

  describe('getApiVersion()', () => {
    it('should return the configured API version', () => {
      // Arrange
      init('any-key', 'v2');
      
      // Act & Assert
      expect(getApiVersion()).toBe('v2');
    });

    it('should return the default API version if not explicitly set', () => {
      // Act & Assert
      expect(getApiVersion()).toBe('v1');
    });
  });
}); 