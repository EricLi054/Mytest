// Implementation of the cache data management logic.

import type { Result } from "@racwa/types";

import { DataCacheError, log } from "./util";

export type DataCache<T> = {
  create: ({
    cacheKey,
    data,
    absoluteTtlMillis,
    slidingTtlMillis,
  }: {
    cacheKey: string;
    data: T;
    absoluteTtlMillis: number;
    slidingTtlMillis: number;
  }) => Promise<Result<{ value: { key: string }; error: DataCacheError.KeyLocked | DataCacheError.KeyConflict }>>;
  get: ({
    cacheKey,
  }: {
    cacheKey: string;
  }) => Promise<Result<{ value: { value: T; ttlMillis: number }; error: DataCacheError.KeyNotFound }>>;
  set: ({
    cacheKey,
    data,
  }: {
    cacheKey: string;
    data: T;
  }) => Promise<Result<{ error: DataCacheError.KeyLocked | DataCacheError.KeyNotFound }>>;
};

export class RedisDataCache<T> implements DataCache<T> {
  #redisClient: RedisClientInterface;
  #keyPrefix: string;

  constructor(redisClient: RedisClientInterface, keyPrefix: string) {
    this.#redisClient = redisClient;
    this.#keyPrefix = keyPrefix;
  }

  #log(action: "CREATE" | "GET" | "SET", message: string) {
    log(`[${this.#keyPrefix}] ${action} - ${message}`);
  }

  #getKey(key: string): string {
    return `${this.#keyPrefix}:${key}`;
  }

  async #lockKey(key: string): Promise<Result<{ error: DataCacheError.KeyLocked }>> {
    const lockResult = await this.#redisClient.set(`${key}:lock`, "1", { NX: true, EX: 5 });

    if (lockResult === null) {
      return { success: false, error: DataCacheError.KeyLocked };
    }

    return { success: true };
  }

  async #unlockKey(key: string): Promise<void> {
    await this.#redisClient.del(`${key}:lock`);
  }

  async create({
    cacheKey,
    data,
    absoluteTtlMillis,
    slidingTtlMillis,
  }: {
    cacheKey: string;
    data: T;
    absoluteTtlMillis: number;
    slidingTtlMillis: number;
  }): Promise<Result<{ value: { key: string }; error: DataCacheError.KeyLocked | DataCacheError.KeyConflict }>> {
    const key = this.#getKey(cacheKey);
    this.#log("CREATE", `Key ${key}`);

    const lockResult = await this.#lockKey(key);
    if (!lockResult.success) {
      this.#log("CREATE", `Failed to acquire lock for key ${key}`);
      return lockResult;
    }

    // Compute proposed expiries
    const now = new Date();
    const absoluteExpiry = new Date(now);
    absoluteExpiry.setMilliseconds(absoluteExpiry.getMilliseconds() + absoluteTtlMillis);
    const slidingExpiry = new Date(now);
    slidingExpiry.setMilliseconds(slidingExpiry.getMilliseconds() + slidingTtlMillis);

    const setResult = await this.#redisClient.set(`${key}:data`, JSON.stringify(data), { NX: true });

    if (setResult === null) {
      this.#log("CREATE", `Failed to set data for key ${key}`);
      await this.#unlockKey(key);
      return { success: false, error: DataCacheError.KeyConflict };
    }

    await this.#redisClient.pExpireAt(`${key}:data`, nextExpiry(absoluteExpiry, slidingExpiry));

    // Succeeded, update metadata
    await this.#redisClient.set(`${key}:absoluteExpiry`, absoluteExpiry.getTime());
    await this.#redisClient.set(`${key}:slidingTtl`, slidingTtlMillis);

    // Make sure metadata keys are cleaned up after the latest time they could be needed
    await this.#redisClient.pExpireAt(`${key}:absoluteExpiry`, absoluteExpiry.getTime());
    await this.#redisClient.pExpireAt(`${key}:slidingTtl`, absoluteExpiry.getTime());

    // Done!
    await this.#unlockKey(key);

    return { success: true, key: cacheKey };
  }

  async get({
    cacheKey,
  }: {
    cacheKey: string;
  }): Promise<Result<{ value: { value: T; ttlMillis: number }; error: DataCacheError.KeyNotFound }>> {
    const key = this.#getKey(cacheKey);
    this.#log("GET", `Key ${key}`);

    const ttlMillis = await this.#redisClient.pTTL(`${key}:data`);

    if (ttlMillis <= 0) {
      this.#log("GET", `Key ${key} expired`);
      return { success: false, error: DataCacheError.KeyNotFound };
    }

    const getResult = await this.#redisClient.get(`${key}:data`);

    if (getResult === null) {
      this.#log("GET", `Key ${key} not found`);
      return { success: false, error: DataCacheError.KeyNotFound };
    }

    return { success: true, value: JSON.parse(getResult) as T, ttlMillis };
  }

  async set({
    cacheKey,
    data,
  }: {
    cacheKey: string;
    data: T;
  }): Promise<Result<{ error: DataCacheError.KeyLocked | DataCacheError.KeyNotFound }>> {
    const key = this.#getKey(cacheKey);
    this.#log("SET", `Key ${key}`);

    const lockResult = await this.#lockKey(key);
    if (!lockResult.success) {
      this.#log("SET", `Failed to acquire lock for key ${key}`);
      return lockResult;
    }

    // Get current metadata
    const absoluteExpiryRaw = await this.#redisClient.get(`${key}:absoluteExpiry`);
    const slidingTtlRaw = await this.#redisClient.get(`${key}:slidingTtl`);

    if (absoluteExpiryRaw === null || slidingTtlRaw === null) {
      this.#log("SET", `Key ${key} missing ttl metadata`);
      await this.#unlockKey(key);
      return { success: false, error: DataCacheError.KeyNotFound };
    }

    // Compute updated expiry times
    const absoluteExpiry = new Date(Number(absoluteExpiryRaw));

    const slidingExpiry = new Date();
    slidingExpiry.setMilliseconds(slidingExpiry.getMilliseconds() + Number(slidingTtlRaw));

    // Update expiry
    await this.#redisClient.pExpireAt(`${key}:data`, nextExpiry(absoluteExpiry, slidingExpiry));

    // Get current key data
    const setResult = await this.#redisClient.set(`${key}:data`, JSON.stringify(data), { XX: true, KEEPTTL: true });
    if (setResult === null) {
      this.#log("SET", `Key ${key} not found`);
      await this.#unlockKey(key);
      return { success: false, error: DataCacheError.KeyNotFound };
    }

    // Done!
    await this.#unlockKey(key);
    return { success: true };
  }
}

// Define the subset of the node-redis API used by the caching layer,
// in order to facilitate mocking.
export type RedisClientInterface = {
  del: (key: string) => Promise<number>;
  pExpireAt: (key: string, unixTimestampMillis: number) => Promise<boolean>;
  pTTL: (key: string) => Promise<number>;
  get: (key: string) => Promise<string | null>;
  set: (key: string, data: string | number, options?: object) => Promise<string | null>;
};

function nextExpiry(absoluteExpiry: Date, slidingExpiry: Date): number {
  return Math.min(absoluteExpiry.getTime(), slidingExpiry.getTime());
}
