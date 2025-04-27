import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import { MistralApi } from '../../src/api';
import { configureRateLimiter, RateLimitExceededError } from '../../src/rate-limiter';

// Mock the fetch function
global.fetch = jest.fn() as jest.Mock;
const mockFetch = global.fetch as jest.Mock;

describe('Rate Limiter Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    // Configure rate limiter with test settings
    configureRateLimiter({
      maxRequestsPerMinute: 3,
      maxRetries: 2,
      initialBackoff: 100,
      maxBackoff: 1000,
      backoffMultiplier: 2,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle rate limits automatically with retries', async () => {
    // Create API client
    const api = new MistralApi('test-api-key');

    // Mock fetch to return 429 once then succeed
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => JSON.stringify({ message: 'Rate limit exceeded' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: 'success' } }],
        }),
      });

    // Make the API call
    const promise = api.generateText('test prompt');

    // Fast-forward through the backoff time
    jest.advanceTimersByTime(100);
    await jest.runOnlyPendingTimersAsync();

    // Verify the result is correct
    const result = await promise;
    expect(result).toBe('success');

    // Verify fetch was called twice
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should fail after max retries are exhausted', async () => {
    // Create API client
    const api = new MistralApi('test-api-key');

    // Mock fetch to always return 429
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => JSON.stringify({ message: 'Rate limit exceeded' }),
    });

    // Make the API call
    const promise = api.generateText('test prompt');

    // Fast-forward through all retry attempts (initial + 2 retries)
    jest.advanceTimersByTime(100); // Initial backoff
    await jest.runOnlyPendingTimersAsync();

    jest.advanceTimersByTime(200); // 1st retry (100 * 2)
    await jest.runOnlyPendingTimersAsync();

    jest.advanceTimersByTime(400); // 2nd retry (200 * 2)
    await jest.runOnlyPendingTimersAsync();

    // Verify the request fails with RateLimitExceededError
    await expect(promise).rejects.toThrow(RateLimitExceededError);

    // Verify fetch was called 3 times (initial + 2 retries)
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should queue requests when rate limit is reached', async () => {
    // Create API client
    const api = new MistralApi('test-api-key');

    // Mock successful responses
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: 'success' } }],
      }),
    });

    // Make multiple API calls in parallel
    const promises = [
      api.generateText('prompt 1'),
      api.generateText('prompt 2'),
      api.generateText('prompt 3'),
      api.generateText('prompt 4'), // This one should be queued
    ];

    // Let the first 3 requests process
    await jest.runOnlyPendingTimersAsync();

    // Verify only 3 calls were made so far
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Fast-forward through the rate limit window
    jest.advanceTimersByTime(60000);
    await jest.runOnlyPendingTimersAsync();

    // Verify the 4th call was made
    expect(mockFetch).toHaveBeenCalledTimes(4);

    // All promises should resolve
    const results = await Promise.all(promises);
    expect(results).toEqual(['success', 'success', 'success', 'success']);
  });
});
