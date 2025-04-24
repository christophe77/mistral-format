import { describe, it, expect, jest } from '@jest/globals';

import * as clientModule from '../../../src/client';
import { toXml } from '../../../src/formatter/toXml';

// Mock the client module
jest.mock('../../../src/client', () => ({
  sendXmlPrompt: jest.fn().mockImplementation(() => Promise.resolve('')),
}));

describe('toXml Formatter', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should generate XML with default options', async () => {
    // Arrange
    const prompt = 'Generate XML for a book catalog';
    const mockResponse =
      '```xml\n<books>\n  <book>\n    <title>Sample Book</title>\n  </book>\n</books>\n```';
    const expectedXml = '<books>\n  <book>\n    <title>Sample Book</title>\n  </book>\n</books>';

    // Mock the sendXmlPrompt function
    jest.spyOn(clientModule, 'sendXmlPrompt').mockResolvedValue(mockResponse);

    // Act
    const result = await toXml(prompt);

    // Assert
    expect(clientModule.sendXmlPrompt).toHaveBeenCalledWith(prompt, undefined, undefined);
    expect(result).toBe(expectedXml);
  });

  it('should generate XML with custom model and options', async () => {
    // Arrange
    const prompt = 'Generate XML for a book catalog';
    const options = {
      model: 'mistral-large' as const,
      options: { temperature: 0.7 },
    };
    const mockResponse =
      '```xml\n<books>\n  <book>\n    <title>Sample Book</title>\n  </book>\n</books>\n```';
    const expectedXml = '<books>\n  <book>\n    <title>Sample Book</title>\n  </book>\n</books>';

    // Mock the sendXmlPrompt function
    jest.spyOn(clientModule, 'sendXmlPrompt').mockResolvedValue(mockResponse);

    // Act
    const result = await toXml(prompt, options);

    // Assert
    expect(clientModule.sendXmlPrompt).toHaveBeenCalledWith(prompt, options.model, options.options);
    expect(result).toBe(expectedXml);
  });

  it('should clean XML response by removing code fences', async () => {
    // Arrange
    const prompt = 'Generate simple XML';
    const mockResponses = [
      '```xml\n<root>\n  <element>value</element>\n</root>\n```',
      '<root>\n  <element>value</element>\n</root>',
      '`<root>\n  <element>value</element>\n</root>`',
    ];
    const expectedXml = '<root>\n  <element>value</element>\n</root>';

    for (const mockResponse of mockResponses) {
      // Mock the sendXmlPrompt function
      jest.spyOn(clientModule, 'sendXmlPrompt').mockReset().mockResolvedValue(mockResponse);

      // Act
      const result = await toXml(prompt);

      // Assert
      expect(result).toBe(expectedXml);
    }
  });

  it('should handle errors gracefully', async () => {
    // Arrange
    const prompt = 'Generate XML for a book catalog';
    const error = new Error('API error');

    // Mock the sendXmlPrompt function to throw an error
    jest.spyOn(clientModule, 'sendXmlPrompt').mockRejectedValue(error);

    // Act & Assert
    await expect(toXml(prompt)).rejects.toThrow('Failed to generate XML response');
  });

  it('should handle empty responses', async () => {
    // Arrange
    const prompt = 'Generate XML';

    // Mock empty response
    jest.spyOn(clientModule, 'sendXmlPrompt').mockResolvedValue('');

    // Act
    const result = await toXml(prompt);

    // Assert
    expect(result).toBe('');
  });
});
