import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Free plan: 20 AI requests / hour. Adjust per-plan in the calling route.
export const freeRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 h") })
  : null;

export const proRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(200, "1 h") })
  : null;

export async function checkRateLimit(userId: string, plan: string) {
  const limiter = plan === "FREE" ? freeRateLimit : proRateLimit;
  if (!limiter) return { success: true }; // no-op if Redis isn't configured (e.g. local dev)
  return limiter.limit(userId);
}
