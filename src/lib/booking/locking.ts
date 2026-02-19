import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Client (standardized for the project)
const redis = Redis.fromEnv();

/**
 * Acquires a distributed lock for a specific resource using Upstash Redis.
 * Uses the SET NX PX atomic operation for safety in serverless environments.
 * @param resourceId Unique identifier (e.g. "lock:booking:session:123")
 * @param ttl Time to live in ms (default 5000ms)
 * @returns A token if lock acquired, null otherwise
 */
export async function acquireLock(resourceId: string, ttl = 5000) {
    const lockKey = `lock:${resourceId}`;
    const token = Math.random().toString(36).substring(2);

    // SET key value NX PX ttl
    const acquired = await redis.set(lockKey, token, {
        nx: true,
        px: ttl
    });

    return acquired === "OK" ? token : null;
}

/**
 * Releases a distributed lock safely using a Lua-like script comparison.
 * @param resourceId The resource ID
 * @param token The token returned by acquireLock
 */
export async function releaseLock(resourceId: string, token: string) {
    const lockKey = `lock:${resourceId}`;
    const storedToken = await redis.get(lockKey);

    if (storedToken === token) {
        await redis.del(lockKey);
        return true;
    }
    return false;
}

/**
 * Helper to run a task within a lock.
 */
export async function withLock<T>(
    resourceId: string,
    task: () => Promise<T>,
    ttl = 5000,
    retries = 3,
    delay = 200
): Promise<T> {
    let token: string | null = null;
    let attempt = 0;

    while (attempt < retries) {
        token = await acquireLock(resourceId, ttl);
        if (token) break;

        attempt++;
        if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    if (!token) {
        throw new Error(`Failed to acquire lock for resource: ${resourceId} after ${retries} attempts`);
    }

    try {
        return await task();
    } finally {
        await releaseLock(resourceId, token).catch((err) => {
            console.error("Failed to release lock:", err);
        });
    }
}
