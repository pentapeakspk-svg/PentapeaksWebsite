import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter. For production with very high traffic, use Upstash Redis or similar.
// Key: "ip:endpoint", Value: { count: number, resetTime: number }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit by IP and endpoint. Returns { allowed: true } or { allowed: false, error: string, retryAfter: number }
 * @param ip Client IP address
 * @param endpoint Endpoint identifier (e.g., "/api/enroll")
 * @param limit Max requests per window
 * @param windowMs Time window in milliseconds (default 1 hour)
 */
export function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number = 10,
  windowMs: number = 60 * 60 * 1000
) {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry) {
    // First request in this window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (entry.resetTime < now) {
    // Window expired, reset
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  // Window still active
  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      error: `Rate limit exceeded. Maximum ${limit} requests per hour.`,
      retryAfter,
    };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Middleware to check rate limit and return 429 if exceeded.
 */
export function createRateLimitMiddleware(
  endpoint: string,
  limit: number = 10,
  windowMs: number = 60 * 60 * 1000
) {
  return (req: NextRequest) => {
    // Extract client IP from request headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const check = checkRateLimit(ip, endpoint, limit, windowMs);

    if (!check.allowed) {
      const headers = new Headers();
      headers.set("Retry-After", check.retryAfter?.toString() || "3600");
      return NextResponse.json({ error: check.error }, { status: 429, headers });
    }

    return null; // Allow request to proceed
  };
}
