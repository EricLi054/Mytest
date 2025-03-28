import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { vi } from "vitest";

export const mockAppRouterInstance = (props: Partial<AppRouterInstance> = {}) =>
  ({
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    ...props,
  }) satisfies AppRouterInstance;

export const mockReadonlyRequestCookies = (props: Omit<Partial<ReadonlyRequestCookies>, "toString"> = {}) =>
  ({
    size: 0,
    has: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    [Symbol.iterator]: vi.fn(),
    toString: vi.fn(),
    ...props,
  }) satisfies ReadonlyRequestCookies;

export const mockReadonlyURLSearchParams = (props: Omit<Partial<ReadonlyURLSearchParams>, "toString"> = {}) =>
  ({
    size: 0,
    get: () => null,
    append: vi.fn(),
    delete: vi.fn(),
    set: vi.fn(),
    sort: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    forEach: vi.fn(),
    entries: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    [Symbol.iterator]: vi.fn(),
    ...props,
  }) satisfies ReadonlyURLSearchParams;
