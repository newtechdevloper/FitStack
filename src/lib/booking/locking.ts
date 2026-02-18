import Redlock from "redlock";
import Redis from "ioredis";

// Initialize Redis Client
// In production, use env vars for Redis URL
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Initialize Redlock
const redlock = new Redlock(
    [redisClient],
    {
        // The expected clock drift; for more details see http://redis.io/topics/distlock
        driftFactor: 0.01, // multiplied by lock ttl to determine drift time

        // The max number of times Redlock will attempt to lock a resource before erroring.
        retryCount: 3,

        // The time in ms between attempts
        retryDelay: 200, // time in ms

        // The max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter: 200 // time in ms
    }
);

redlock.on("clientError", function (err) {
    console.error("A redis error has occurred:", err);
});

/**
 * Acquires a distributed lock for a specific resource.
 * @param resourceId Unique identifier (e.g. "booking:session:123")
 * @param ttl Time to live in ms (default 5000ms)
 * @returns Lock object (must be released)
 */
export async function acquireLock(resourceId: string, ttl = 5000) {
    try {
        const lock = await redlock.acquire([resourceId], ttl);
        return lock;
    } catch (error) {
        throw new Error(`Failed to acquire lock for resource: ${resourceId}`);
    }
}

/**
 * Helper to run a task within a lock.
 */
export async function withLock<T>(resourceId: string, task: () => Promise<T>, ttl = 5000): Promise<T> {
    let lock;
    try {
        lock = await acquireLock(resourceId, ttl);
        return await task();
    } finally {
        if (lock) {
            await lock.release().catch((err) => {
                console.error("Failed to release lock:", err);
            });
        }
    }
}
