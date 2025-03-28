import { vi } from "vitest";

import type { DataCache } from "@racwa/cache";

type MockDataCache<T> = Pick<DataCache<T>, "create" | "get" | "set">;

export const mockDataCache = <T>(props: Partial<MockDataCache<T>> = {}) =>
  ({
    create: vi.fn<MockDataCache<T>["create"]>(),
    get: vi.fn<MockDataCache<T>["get"]>(),
    set: vi.fn<MockDataCache<T>["set"]>(),
    ...props,
  }) satisfies MockDataCache<T>;
