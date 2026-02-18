
// Simple Token Bucket Rate Limiter (Memory-based for MVP / Fallback)
// In production, swap this with @upstash/ratelimit backed by Redis.

interface RatelimitConfig {
    limit: number;
    window: number; // in seconds
}

const trackers = new Map<string, number[]>();

export async function rateLimit(identifier: string, config: RatelimitConfig = { limit: 10, window: 10 }) {
    const now = Date.now();
    const windowStart = now - (config.window * 1000);

    const timestamps = trackers.get(identifier) || [];

    // Filter out old requests
    const recentRequests = timestamps.filter(t => t > windowStart);

    if (recentRequests.length >= config.limit) {
        return { success: false, limit: config.limit, remaining: 0, reset: Math.floor((recentRequests[0] + (config.window * 1000)) / 1000) };
    }

    recentRequests.push(now);
    trackers.set(identifier, recentRequests);

    return {
        success: true,
        limit: config.limit,
        remaining: config.limit - recentRequests.length,
        reset: Math.floor((now + (config.window * 1000)) / 1000)
    };
}
