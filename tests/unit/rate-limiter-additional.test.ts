import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import {
  RateLimiter,
  RateLimitExceededError,
  DEFAULT_RATE_LIMITER_OPTIONS,
  getRateLimiter,
  configureRateLimiter,
} from '../../src/rate-limiter';

describe('Rate Limiter Additional Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset the singleton instance between tests
    // @ts-ignore - accessing private property for testing
    global.rateLimiter = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('queue processing', () => {
    it('should process multiple queued requests in order', async () => {
      const limiter = new RateLimiter({
        maxRequestsPerMinute: 2,
        maxRetries: 0,
      });

      const results: number[] = [];

      // Create 3 promises that will be queued
      const promises = [
        limiter.execute(async () => {
          results.push(1);
          return 1;
        }),
        limiter.execute(async () => {
          results.push(2);
          return 2;
        }),
        limiter.execute(async () => {
          results.push(3);
          return 3;
        }),
      ];

      // Let the queue process the first two immediately
      await jest.runAllTimersAsync();

      // The first two should be processed
      expect(results).toEqual([1, 2]);

      // Then let the rate limit pass
      jest.advanceTimersByTime(60000);
      await jest.runAllTimersAsync();

      // Now the third one should be processed
      expect(results).toEqual([1, 2, 3]);

      // All promises should resolve
      const allResults = await Promise.all(promises);
      expect(allResults).toEqual([1, 2, 3]);
    });

    it('should handle errors in the queue without breaking', async () => {
      const limiter = new RateLimiter({ maxRequestsPerMinute: 3 });

      const successFn = jest.fn().mockResolvedValue('success');
      const errorFn = jest.fn().mockRejectedValue(new Error('test error'));

      // Queue a function that will succeed
      const promise1 = limiter.execute(successFn);

      // Queue a function that will fail
      const promise2 = limiter.execute(errorFn);

      // Queue another function that will succeed
      const promise3 = limiter.execute(successFn);

      // Let the queue process
      await jest.runAllTimersAsync();

      // Verify the first promise succeeds
      await expect(promise1).resolves.toBe('success');

      // Verify the second promise fails
      await expect(promise2).rejects.toThrow('test error');

      // Verify the third promise succeeds despite the previous failure
      await expect(promise3).resolves.toBe('success');

      // Verify all functions were called
      expect(successFn).toHaveBeenCalledTimes(2);
      expect(errorFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('recordRequest', () => {
    it('should clean up old timestamps', () => {
      const limiter = new RateLimiter();

      // Mock Date.now to return a fixed value
      const realDateNow = Date.now;
      const mockNow = 1000000;
      global.Date.now = jest.fn().mockReturnValue(mockNow);

      // Add some old timestamps (more than a minute old)
      // @ts-ignore - accessing private property for testing
      limiter.requestTimestamps = [
        mockNow - 70000, // older than 1 minute
        mockNow - 65000, // older than 1 minute
        mockNow - 30000, // less than 1 minute
        mockNow - 10000, // less than 1 minute
      ];

      // @ts-ignore - accessing private method for testing
      limiter.recordRequest();

      // @ts-ignore - accessing private property for testing
      expect(limiter.requestTimestamps).toEqual([
        mockNow - 30000,
        mockNow - 10000,
        mockNow, // new timestamp that was just added
      ]);

      // Restore the original Date.now
      global.Date.now = realDateNow;
    });
  });

  describe('waitForRateLimit', () => {
    it('should wait when rate limit is reached', async () => {
      const limiter = new RateLimiter({ maxRequestsPerMinute: 3 });

      // Mock Date.now to return a fixed value
      const realDateNow = Date.now;
      const mockNow = 1000000;
      global.Date.now = jest.fn().mockReturnValue(mockNow);

      // Add timestamps to reach the rate limit
      // @ts-ignore - accessing private property for testing
      limiter.requestTimestamps = [
        mockNow - 40000, // first request
        mockNow - 20000, // second request
        mockNow - 10000, // third request (reaching the limit)
      ];

      // Setup a spy on setTimeout
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      // Call waitForRateLimit
      // @ts-ignore - accessing private method for testing
      const waitPromise = limiter.waitForRateLimit();

      // Verify setTimeout was called with the correct time
      // (the oldest timestamp + 60000) - current time
      expect(setTimeoutSpy).toHaveBeenCalledWith(
        expect.any(Function),
        20000, // 60000 - (mockNow - (mockNow - 40000))
      );

      // Fast-forward time
      jest.advanceTimersByTime(20000);
      await waitPromise;

      // Restore the original Date.now
      global.Date.now = realDateNow;
    });

    it('should not wait when under the rate limit', async () => {
      const limiter = new RateLimiter({ maxRequestsPerMinute: 3 });

      // Add only 2 timestamps (under the limit)
      // @ts-ignore - accessing private property for testing
      limiter.requestTimestamps = [Date.now() - 20000, Date.now() - 10000];

      // Setup a spy on setTimeout
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      // Call waitForRateLimit
      // @ts-ignore - accessing private method for testing
      await limiter.waitForRateLimit();

      // Verify setTimeout was not called
      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('getRateLimiter and configureRateLimiter', () => {
    it('should create a new limiter with options when configuring', () => {
      // First get the default limiter
      const defaultLimiter = getRateLimiter();

      // Then configure with new options
      configureRateLimiter({ maxRequestsPerMinute: 42 });

      // Get the reconfigured limiter
      const configuredLimiter = getRateLimiter();

      // Verify it's a new instance
      expect(configuredLimiter).not.toBe(defaultLimiter);

      // Verify it has the new options
      // @ts-ignore - accessing private property for testing
      expect(configuredLimiter.options.maxRequestsPerMinute).toBe(42);

      // Verify other options are still defaults
      // @ts-ignore - accessing private property for testing
      expect(configuredLimiter.options.maxRetries).toBe(DEFAULT_RATE_LIMITER_OPTIONS.maxRetries);
    });

    it('should create a new limiter with options when getting with options', () => {
      // First get the default limiter
      const defaultLimiter = getRateLimiter();

      // Then get with new options
      const configuredLimiter = getRateLimiter({ maxRetries: 10 });

      // Verify it's a new instance
      expect(configuredLimiter).not.toBe(defaultLimiter);

      // Verify it has the new options
      // @ts-ignore - accessing private property for testing
      expect(configuredLimiter.options.maxRetries).toBe(10);

      // Verify other options are still defaults
      // @ts-ignore - accessing private property for testing
      expect(configuredLimiter.options.maxRequestsPerMinute).toBe(
        DEFAULT_RATE_LIMITER_OPTIONS.maxRequestsPerMinute,
      );
    });
  });
});
