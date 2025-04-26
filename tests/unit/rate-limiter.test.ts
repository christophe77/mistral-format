import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import {
  RateLimiter,
  RateLimitExceededError,
  DEFAULT_RATE_LIMITER_OPTIONS,
  getRateLimiter,
  configureRateLimiter,
} from '../../src/rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create a rate limiter with default options', () => {
    const limiter = new RateLimiter();

    // @ts-ignore - accessing private property for testing
    expect(limiter.options).toEqual(DEFAULT_RATE_LIMITER_OPTIONS);
  });

  it('should create a rate limiter with custom options', () => {
    const customOptions = {
      maxRequestsPerMinute: 30,
      maxRetries: 3,
      initialBackoff: 2000,
      maxBackoff: 30000,
      backoffMultiplier: 3,
    };

    const limiter = new RateLimiter(customOptions);

    // @ts-ignore - accessing private property for testing
    expect(limiter.options).toEqual(customOptions);
  });

  it('should execute a function successfully', async () => {
    const limiter = new RateLimiter();
    const mockFn = jest.fn().mockResolvedValue('success');

    const result = await limiter.execute(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on 429 errors', async () => {
    const limiter = new RateLimiter({
      maxRetries: 2,
      initialBackoff: 100,
      maxBackoff: 1000,
      backoffMultiplier: 2,
      maxRequestsPerMinute: 60,
    });

    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('API request failed with status 429'))
      .mockResolvedValueOnce('success after retry');

    const executePromise = limiter.execute(mockFn);

    // Fast-forward past the backoff time
    jest.advanceTimersByTime(200);

    const result = await executePromise;

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result).toBe('success after retry');
  });

  it('should throw RateLimitExceededError after max retries', async () => {
    const limiter = new RateLimiter({
      maxRetries: 2,
      initialBackoff: 100,
      maxBackoff: 1000,
      backoffMultiplier: 2,
      maxRequestsPerMinute: 60,
    });

    const mockFn = jest.fn().mockRejectedValue(new Error('API request failed with status 429'));

    const executePromise = limiter.execute(mockFn);

    // Fast-forward past backoff times (initial + retry1 + retry2)
    jest.advanceTimersByTime(100);
    jest.advanceTimersByTime(200);

    await expect(executePromise).rejects.toThrow(RateLimitExceededError);
    expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should not retry on non-429 errors', async () => {
    const limiter = new RateLimiter();
    const error = new Error('Some other error');
    const mockFn = jest.fn().mockRejectedValue(error);

    await expect(limiter.execute(mockFn)).rejects.toThrow(error);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should rate limit requests that exceed the maximum per minute', async () => {
    const limiter = new RateLimiter({
      maxRequestsPerMinute: 2,
      maxRetries: 1,
      initialBackoff: 100,
      maxBackoff: 1000,
      backoffMultiplier: 2,
    });

    const mockFn = jest.fn().mockResolvedValue('success');

    // First two requests should be immediate
    const promise1 = limiter.execute(mockFn);
    const promise2 = limiter.execute(mockFn);

    await promise1;
    await promise2;

    expect(mockFn).toHaveBeenCalledTimes(2);

    // Third request should be rate limited
    const promise3 = limiter.execute(mockFn);

    // Should not be completed yet
    expect(mockFn).toHaveBeenCalledTimes(2);

    // Fast-forward time to allow the rate limit to pass
    jest.advanceTimersByTime(60000);

    await promise3;

    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should provide a global rate limiter instance', () => {
    const limiter1 = getRateLimiter();
    const limiter2 = getRateLimiter();

    expect(limiter1).toBe(limiter2);
  });

  it('should allow reconfiguring the global rate limiter', () => {
    const customOptions = {
      maxRequestsPerMinute: 30,
    };

    configureRateLimiter(customOptions);

    const limiter = getRateLimiter();

    // @ts-ignore - accessing private property for testing
    expect(limiter.options.maxRequestsPerMinute).toBe(30);
    // @ts-ignore - check that other options are still the defaults
    expect(limiter.options.maxRetries).toBe(DEFAULT_RATE_LIMITER_OPTIONS.maxRetries);
  });

  it('should wrap a function with rate limiting', async () => {
    const limiter = new RateLimiter();

    const originalFn = jest
      .fn()
      .mockImplementation((x: number, y: number) => Promise.resolve(x + y));

    const wrappedFn = RateLimiter.wrap(originalFn, limiter);

    const result = await wrappedFn(3, 4);

    expect(result).toBe(7);
    expect(originalFn).toHaveBeenCalledWith(3, 4);
  });
});
