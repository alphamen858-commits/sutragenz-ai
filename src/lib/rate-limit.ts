import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Free plan: 20 AI requests / hour.
export const freeRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 h") })
  : null;

// Pro plan: 200 AI requests / hour.
export const proRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(200, "1 h") })
  : null;

// Premium plan: no meaningful cap — set generously high rather than
// skipping the check entirely, so a single account still can't hammer
// the API without limit if a key gets compromised.
export const premiumRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5000, "1 h") })
  : null;

export async function checkRateLimit(userId: string, plan: string) {
  const limiter =
    plan === "PREMIUM" ? premiumRateLimit : plan === "PRO" ? proRateLimit : freeRateLimit;
  if (!limiter) return { success: true }; // no-op if Redis isn't configured (e.g. local dev)
  return limiter.limit(userId);
}
