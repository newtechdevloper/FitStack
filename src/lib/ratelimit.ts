
// Production-safe Rate Limiter
// Uses Upstash Redis (sliding window) when UPSTASH_REDIS_REST_URL is configured.
// Falls back to fail-open (allow all) when Redis is not available — prevents
// breaking the app in environments without Redis (e.g. local dev, preview deploys).
//
// To enable: add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to Vercel env vars.
// Install: npm install @upstash/ratelimit @upstash/redis

let ratelimiter: any = null;

async function getRateLimiter() {
    if (ratelimiter) return ratelimiter;

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null; // Redis not configured — fail open
    }

    try {
        const { Ratelimit } = await import("@upstash/ratelimit");
        const { Redis } = await import("@upstash/redis");

        ratelimiter = new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(10, "10 s"),
            analytics: false,
            prefix: "nexus_rl",
        });

        return ratelimiter;
    } catch {
        // Package not installed — fail open
        return null;
    }
}

export async function rateLimit(identifier: string) {
    const limiter = await getRateLimiter();

    if (!limiter) {
        // No Redis configured — allow all requests (fail-open)
        return { success: true, limit: 10, remaining: 10, reset: 0 };
    }

    const result = await limiter.limit(identifier);
    return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
    };
}
