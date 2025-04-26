/**
 * Rate limiter for Mistral API requests
 * Provides request throttling and automatic retries with exponential backoff
 */

import { MistralError } from './errors';

// Rate limiter configuration options
export interface RateLimiterOptions {
  /** Maximum requests per minute (default: 60) */
  maxRequestsPerMinute: number;
  /** Maximum retry attempts for 429 errors (default: 5) */
  maxRetries: number;
  /** Initial backoff time in milliseconds (default: 1000) */
  initialBackoff: number;
  /** Maximum backoff time in milliseconds (default: 60000) */
  maxBackoff: number;
  /** Backoff multiplier for each retry (default: 2) */
  backoffMultiplier: number;
}

// Default rate limiter configuration
export const DEFAULT_RATE_LIMITER_OPTIONS: RateLimiterOptions = {
  maxRequestsPerMinute: 60,
  maxRetries: 5,
  initialBackoff: 1000, // 1 second
  maxBackoff: 60000, // 60 seconds
  backoffMultiplier: 2,
};

// Error for rate limiter failures
export class RateLimitExceededError extends MistralError {
  constructor(message: string, public attempts: number) {
    super(message);
    this.name = 'RateLimitExceededError';
  }
}

/**
 * Rate limiter for managing API requests to prevent 429 errors
 */
export class RateLimiter {
  private requestTimestamps: number[] = [];
  private options: RateLimiterOptions;
  private requestQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    execute: () => Promise<unknown>;
  }> = [];
  private processingQueue = false;

  constructor(options?: Partial<RateLimiterOptions>) {
    this.options = { ...DEFAULT_RATE_LIMITER_OPTIONS, ...options };
  }

  /**
   * Executes a function with retry logic for 429 errors
   * @param fn - Function to execute
   * @returns Result of the function
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.requestQueue.push({
        resolve: resolve as (value: unknown) => void,
        reject,
        execute: async () => {
          let attempts = 0;
          let backoff = this.options.initialBackoff;

          while (attempts <= this.options.maxRetries) {
            try {
              // Only proceed if we're not rate limited
              await this.waitForRateLimit();

              // Execute the function
              const result = await fn();

              // Record this request time
              this.recordRequest();

              return result;
            } catch (error) {
              // Only retry on 429 errors
              if (error instanceof Error && error.message && error.message.includes('429')) {
                attempts++;

                // If we've exceeded our retry attempts, fail
                if (attempts > this.options.maxRetries) {
                  throw new RateLimitExceededError(
                    `Rate limit exceeded after ${attempts} attempts`,
                    attempts,
                  );
                }

                // Wait with exponential backoff
                const jitter = Math.random() * 0.3 + 0.85; // 0.85-1.15 jitter
                const waitTime = Math.min(backoff * jitter, this.options.maxBackoff);

                // Increase backoff for next attempt
                backoff = backoff * this.options.backoffMultiplier;

                await new Promise<void>(resolveTimeout => {
                  setTimeout(() => {
                    resolveTimeout();
                  }, waitTime);
                });
              } else {
                // For other errors, just pass them through
                throw error;
              }
            }
          }

          throw new RateLimitExceededError(
            `Rate limit exceeded after ${attempts} attempts`,
            attempts,
          );
        },
      });

      // Start processing the queue if not already processing
      if (!this.processingQueue) {
        void this.processQueue();
      }
    });
  }

  /**
   * Records a new request timestamp
   */
  private recordRequest(): void {
    const now = Date.now();
    this.requestTimestamps.push(now);

    // Clean up old timestamps (older than 1 minute)
    const oneMinuteAgo = now - 60000;
    this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
  }

  /**
   * Waits until a request can be made according to rate limits
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean up old timestamps
    this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);

    // Check if we're at the rate limit
    if (this.requestTimestamps.length >= this.options.maxRequestsPerMinute) {
      // Calculate how long to wait
      const oldestTimestamp = this.requestTimestamps[0];
      const timeToWait = 60000 - (now - oldestTimestamp);

      if (timeToWait > 0) {
        await new Promise<void>(resolveTimeout => {
          setTimeout(() => {
            resolveTimeout();
          }, timeToWait);
        });
      }
    }
  }

  /**
   * Processes the queue of pending requests
   */
  private async processQueue(): Promise<void> {
    if (this.requestQueue.length === 0) {
      this.processingQueue = false;
      return;
    }

    this.processingQueue = true;
    const { resolve, reject, execute } = this.requestQueue.shift()!;

    try {
      const result = await execute();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Process next item in the queue
    void this.processQueue();
  }

  /**
   * Creates a wrapped version of a function that uses rate limiting
   * @param fn Function to wrap
   * @returns Rate-limited version of the function
   */
  static wrap<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    limiter: RateLimiter,
  ): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
      return limiter.execute(() => fn(...args)) as Promise<ReturnType<T>>;
    };
  }
}

// Singleton instance for global usage
let rateLimiter: RateLimiter | null = null;

/**
 * Get the global rate limiter instance
 * @param options Optional configuration options
 * @returns RateLimiter instance
 */
export function getRateLimiter(options?: Partial<RateLimiterOptions>): RateLimiter {
  if (!rateLimiter || options) {
    rateLimiter = new RateLimiter(options);
  }
  return rateLimiter;
}

/**
 * Configure the global rate limiter
 * @param options Rate limiter configuration options
 */
export function configureRateLimiter(options: Partial<RateLimiterOptions>): void {
  rateLimiter = new RateLimiter(options);
}
