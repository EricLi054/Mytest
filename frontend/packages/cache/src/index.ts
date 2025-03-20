import type { RedisClientInterface } from "./cache";
import { RedisDataCache } from "./cache";
import { createRedisClient } from "./client";
import { log } from "./util";

export type { DataCache } from "./cache";
export { DataCacheError } from "./util";

// By creating a global factory in this way, we can share this across modules
// but still allow the consuming application to dictate when it is initialized.

declare global {
  // Keyword var is required to attach to globalThis
  // eslint-disable-next-line no-var
  var _racwa_cache_dataCacheFactory: DataCacheFactory | undefined;
  // eslint-disable-next-line no-var
  var enableCacheLogging: boolean | undefined;
}

/**
 * Setup all requirements for the cache connection to function correctly,
 * including auth, connection to the Redis instance, and configuration of error
 * handling and timed re-authentication.
 *
 * This should only be called once per application, unless there is a need for
 * multiple concurrent connections to Redis.
 * @param redisHost DNS name of the Redis instance to point at,
 * e.g. next-rac-redis-$ENV.redis.cache.windows.net
 * @param appName A namespace for the application, to allow for scoped access
 * permissions, e.g. MOTORING
 * @param enableCacheLogging A flag to enable the logging of cache operations. Defaults to true.
 */
export async function initCaching({
  redisHost,
  appName,
  enableCacheLogging = true,
}: {
  redisHost: string;
  appName: string;
  enableCacheLogging?: boolean;
}): Promise<void> {
  globalThis.enableCacheLogging = true;

  log(`Initialising cache for ${appName}`);

  // Only do initialization once.
  if (!globalThis._racwa_cache_dataCacheFactory) {
    log(`Creating Redis client for ${appName}`);
    const redisClient = await createRedisClient(redisHost);
    const appPrefix = `${appName}:`;

    globalThis._racwa_cache_dataCacheFactory = new DataCacheFactory({ redisClient, appPrefix });
  } else {
    log(`Redis client already exists for ${appName}`);
  }

  log(`Cache initialised for ${appName}`);

  globalThis.enableCacheLogging = enableCacheLogging;
}

/**
 * Retrieve a cache for the specified type of varaible, utilizing the shared
 * cache connection.
 * @param instanceName A sub-namespace for the specific kind of object being
 * stored by this cache, e.g. UYV:SESSION
 */
export function getCacheFor<T>({ instanceName }: { instanceName: string }): RedisDataCache<T> {
  if (!globalThis._racwa_cache_dataCacheFactory) {
    throw new Error("Caching must have been initialized using initCaching() before making a call to getCacheFor().");
  }

  return globalThis._racwa_cache_dataCacheFactory.getCacheFor({ instanceName });
}

class DataCacheFactory {
  readonly #redisClient: RedisClientInterface;
  readonly #appPrefix: string;

  constructor({ redisClient, appPrefix }: { redisClient: RedisClientInterface; appPrefix: string }) {
    this.#redisClient = redisClient;
    this.#appPrefix = appPrefix;
  }

  getCacheFor<T>({ instanceName }: { instanceName: string }): RedisDataCache<T> {
    return new RedisDataCache<T>(this.#redisClient, `${this.#appPrefix}${instanceName}`);
  }
}
