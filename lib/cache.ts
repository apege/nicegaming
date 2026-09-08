type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Ultra-lightweight in-memory cache for Cloudflare Workers / Serverless runtime.
 * Drastically reduces database hits (Neon Compute CU & Network Transfer) to near zero for repeated reads.
 */
export function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlSeconds: number = 60): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function invalidateCache(keyPrefixOrExact: string): void {
  for (const key of memoryCache.keys()) {
    if (key === keyPrefixOrExact || key.startsWith(keyPrefixOrExact)) {
      memoryCache.delete(key);
    }
  }
}
