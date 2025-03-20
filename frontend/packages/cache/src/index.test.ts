import { describe, expect, it } from "vitest";

import type { RedisClientInterface } from "./cache";
import { RedisDataCache } from "./cache";
import { DataCacheError } from "./util";

class MockRedisClient implements RedisClientInterface {
  keys: Record<string, string>;
  expiries: Record<string, number>;

  constructor() {
    this.keys = {};
    this.expiries = {};
  }

  #exists(key: string): boolean {
    const now = new Date().getTime();

    const value = this.keys[`${key}`];
    if (value === undefined) {
      return false;
    }

    const expiry = this.expiries[`${key}`];
    if (expiry !== undefined && Number(expiry) < now) {
      return false;
    }

    return true;
  }

  del(key: string): Promise<number> {
    if (!this.#exists(key)) {
      return Promise.resolve(0);
    }

    delete this.keys[`${key}`];
    return Promise.resolve(1);
  }

  pExpireAt(key: string, unixTimestampMillis: number): Promise<boolean> {
    if (!this.#exists(key)) {
      return Promise.resolve(false);
    }

    this.expiries[`${key}`] = unixTimestampMillis;
    return Promise.resolve(true);
  }

  pTTL(key: string): Promise<number> {
    if (!this.#exists(key)) {
      return Promise.resolve(-1);
    }

    const expiryTimestamp = this.expiries[`${key}`];

    if (!expiryTimestamp) {
      return Promise.resolve(-1);
    }

    const ttl = expiryTimestamp - new Date().getTime();

    return Promise.resolve(ttl);
  }

  get(key: string): Promise<string | null> {
    if (!this.#exists(key)) {
      return Promise.resolve(null);
    }

    // If the #exists check passes, the key definitely exists.
    const value = this.keys[`${key}`] ?? null;
    return Promise.resolve(value);
  }

  set(
    key: string,
    data: string | number,
    options?: {
      EX?: number;
      KEEPTTL?: true;
      NX?: true;
      XX?: true;
    },
  ): Promise<string | null> {
    if (options?.NX === true && this.#exists(key)) {
      return Promise.resolve(null);
    }

    if (options?.XX === true && !this.#exists(key)) {
      return Promise.resolve(null);
    }

    this.keys[`${key}`] = data.toString();

    if (options?.EX === undefined) {
      if (options?.KEEPTTL === undefined) {
        delete this.expiries[`${key}`];
      }
    } else {
      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + options.EX);
      this.expiries[`${key}`] = expiry.getTime();
    }

    return Promise.resolve("OK");
  }
}

const data = "test-data";
const absoluteTtlMillis = 10 * 1000;
const slidingTtlMillis = 3 * 1000;

describe("cache", () => {
  it("should retrieve value after saving", async () => {
    // Arrange
    const mockClient = new MockRedisClient();
    const cacheProvider = new RedisDataCache<string>(mockClient, "test-appPrefix:test-instancePrefix");
    const cacheKey = crypto.randomUUID();

    // Act
    await cacheProvider.create({ cacheKey, data: "", absoluteTtlMillis, slidingTtlMillis });
    await cacheProvider.set({ cacheKey, data });
    const result = await cacheProvider.get({ cacheKey });

    // Assert
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toBe(data);
      expect(result.ttlMillis).toBeGreaterThan(0);
    }
  });

  it("should return KeyNotFound error when attempting to read expired key", async () => {
    // Arrange
    const mockClient = new MockRedisClient();
    const cacheProvider = new RedisDataCache<string>(mockClient, "test-appPrefix:test-instancePrefix");
    const cacheKey = crypto.randomUUID();

    // Act
    await cacheProvider.create({ cacheKey, data: "", absoluteTtlMillis: 0, slidingTtlMillis: 0 });
    const result = await cacheProvider.get({ cacheKey });

    // Assert
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toBe(DataCacheError.KeyNotFound);
    }
  });

  it("should return KeyNotFound error when attempting to read missing key", async () => {
    // Arrange
    const mockClient = new MockRedisClient();
    const cacheProvider = new RedisDataCache<string>(mockClient, "test-appPrefix:test-instancePrefix");

    // Act
    const result = await cacheProvider.get({ cacheKey: "missing-key" });

    // Assert
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toBe(DataCacheError.KeyNotFound);
    }
  });

  it("should expire value after sliding TTL when not used", async () => {
    // Arrange
    const mockClient = new MockRedisClient();
    const cacheProvider = new RedisDataCache<string>(mockClient, "test-appPrefix:test-instancePrefix");
    const cacheKey = crypto.randomUUID();

    // Act
    await cacheProvider.create({ cacheKey, data: "", absoluteTtlMillis, slidingTtlMillis });
    await cacheProvider.set({ cacheKey, data });

    await new Promise((r) => setTimeout(r, slidingTtlMillis * 1.25));

    const result = await cacheProvider.get({ cacheKey });

    // Assert
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toBe(DataCacheError.KeyNotFound);
    }
  });

  it("should have expiry extended by sliding TTL when value written", async () => {
    // Arrange
    const newData = "test-data-new";
    const mockClient = new MockRedisClient();
    const cacheProvider = new RedisDataCache<string>(mockClient, "test-appPrefix:test-instancePrefix");
    const cacheKey = crypto.randomUUID();

    // Act
    await cacheProvider.create({ cacheKey, data: "", absoluteTtlMillis, slidingTtlMillis });
    await cacheProvider.set({ cacheKey, data });

    await new Promise((r) => setTimeout(r, slidingTtlMillis * 0.75));

    // Touch data
    await cacheProvider.set({ cacheKey, data: newData });

    await new Promise((r) => setTimeout(r, slidingTtlMillis * 0.75));

    // Try again
    const value = await cacheProvider.get({ cacheKey });

    // Assert
    expect(value.success).toBe(true);
  });
});
