import type { H3Event } from 'h3';

type RateLimitOptions = {
  /** Bucket name, e.g. `login` or `form:contact`. */
  key: string;
  /** Requests allowed per window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Identifier to limit by. Defaults to the client IP. */
  id?: string;
  /** Field the validation error is attached to (shown by `useValidate`). */
  path?: string;
  message?: string;
};

const hits = new Map<string, { count: number; reset: number }>();

let lastSweep = 0;

/**
 * Client IP for rate limiting. Uses the LAST `X-Forwarded-For` entry (the one appended by
 * our own reverse proxy), not the first, which the client controls and can spoof.
 */
export const getClientIP = (event: H3Event) => {
  const forwarded = getRequestHeader(event, 'x-forwarded-for');
  const last = forwarded?.split(',').pop()?.trim();

  return last || getRequestIP(event) || 'unknown';
};

/**
 * In-memory fixed-window rate limiter. Throws 429 when the limit is exceeded.
 * State is per process: fine for a single pm2 instance, use a shared store for clusters.
 */
export const rateLimit = (event: H3Event, options: RateLimitOptions) => {
  const { key, max, windowMs, path = 'form', message = 'Too many requests, please try again later' } = options;
  const now = Date.now();

  if (now - lastSweep > 60_000) {
    for (const [bucket, entry] of hits) if (entry.reset <= now) hits.delete(bucket);

    lastSweep = now;
  }

  const bucket = `${key}:${options.id ?? getClientIP(event)}`;
  const entry = hits.get(bucket);

  if (!entry || entry.reset <= now) {
    hits.set(bucket, { count: 1, reset: now + windowMs });

    return;
  }

  entry.count++;

  if (entry.count > max) {
    setResponseHeader(event, 'Retry-After', Math.ceil((entry.reset - now) / 1000));

    throw createError({ status: 429, statusMessage: 'Too Many Requests', data: [{ message, path }] });
  }
};
