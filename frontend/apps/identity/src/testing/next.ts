import type { SessionContextValue } from "next-auth/react";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
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

export const mockAuthenticatedUseSessionInstance = () =>
  ({
    status: "authenticated",
    update: () => Promise.resolve(null),
    data: { expires: "" },
  }) satisfies SessionContextValue;

export const mockUnauthenticatedUseSessionInstance = () =>
  ({
    status: "unauthenticated",
    update: () => Promise.resolve(null),
    data: null,
  }) satisfies SessionContextValue;

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
