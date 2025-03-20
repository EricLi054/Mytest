import { getCrmId } from "#utils/session/getCrmId";
import { describe, expect, it, vi } from "vitest";

import type { DataCache } from "@racwa/cache";
import { DataCacheError } from "@racwa/cache";

import type { PersonCache } from ".";
import { getPersonCache, invalidatePersonCache, upsertPersonCache } from ".";

const mockCrmId = "mock_crm_id";
const expectedAbsoluteTtl = 300_000;
const expectedSlidingTtl = 60_000;

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId");

type MockDataCache<T> = Pick<DataCache<T>, "create" | "get" | "set">;
const mockDataCache = <T>(props: Partial<MockDataCache<T>> = {}) =>
  ({
    create: vi.fn<MockDataCache<T>["create"]>(),
    get: vi.fn<MockDataCache<T>["get"]>(),
    set: vi.fn<MockDataCache<T>["set"]>(),
    ...props,
  }) satisfies MockDataCache<T>;

const mockCacheCreate = vi.hoisted(() => vi.fn<DataCache<PersonCache>["create"]>());
const mockCacheGet = vi.hoisted(() => vi.fn<DataCache<PersonCache>["get"]>());
const mockCacheSet = vi.hoisted(() => vi.fn<DataCache<PersonCache>["set"]>());

vi.mock("@racwa/cache", async () => {
  const actual = await vi.importActual("@racwa/cache");

  return {
    ...actual,
    getCacheFor: () => mockDataCache({ create: mockCacheCreate, get: mockCacheGet, set: mockCacheSet }),
  };
});

const mockPerson: PersonCache = {
  racId: "123412341234",
  tier: "Blue",
  membershipCardNumber: "1234",
  membershipType: "Voting Member",
  title: "Mr",
  firstName: "John",
  middleName: "",
  surname: "Smith",
  homePhone: "0893001234",
  mobilePhone: "0400123456",
  personalEmailAddress: "testing@rac.com.au",
  workPhone: "",
};

describe("Person Cache", () => {
  it("should get a cached person", async () => {
    mockCacheGet.mockResolvedValueOnce({ success: true, value: mockPerson, ttlMillis: expectedAbsoluteTtl });
    vi.mocked(getCrmId).mockResolvedValueOnce(mockCrmId);

    const cachedPerson = await getPersonCache();

    expect(cachedPerson).toEqual(mockPerson);
  });

  it("should return null if not found", async () => {
    mockCacheGet.mockResolvedValueOnce({ success: false, error: DataCacheError.KeyNotFound });
    vi.mocked(getCrmId).mockResolvedValueOnce(mockCrmId);

    const cachedPerson = await getPersonCache();

    expect(cachedPerson).toEqual(null);
  });

  it("should invalidate the person cache", async () => {
    mockCacheSet.mockResolvedValueOnce({ success: true });
    vi.mocked(getCrmId).mockResolvedValueOnce(mockCrmId);

    const successfullyInvalidated = await invalidatePersonCache();

    expect(successfullyInvalidated).toEqual(true);
  });

  it("should create the person cache if it doesn't exist", async () => {
    mockCacheGet.mockResolvedValueOnce({ success: false, error: DataCacheError.KeyNotFound });
    mockCacheCreate.mockResolvedValueOnce({ success: true, key: mockCrmId });
    vi.mocked(getCrmId).mockResolvedValueOnce(mockCrmId);

    const success = await upsertPersonCache(mockPerson);

    expect(success).toEqual(true);
    expect(mockCacheCreate).toHaveBeenCalledWith({
      cacheKey: mockCrmId,
      data: mockPerson,
      absoluteTtlMillis: expectedAbsoluteTtl,
      slidingTtlMillis: expectedSlidingTtl,
    });
  });

  it("should set the person cache if it already exists", async () => {
    mockCacheGet.mockResolvedValueOnce({ success: true, value: mockPerson, ttlMillis: expectedAbsoluteTtl });
    mockCacheSet.mockResolvedValueOnce({ success: true });
    vi.mocked(getCrmId).mockResolvedValueOnce(mockCrmId);

    const success = await upsertPersonCache(mockPerson);

    expect(success).toEqual(true);
    expect(mockCacheSet).toHaveBeenCalledWith({
      cacheKey: mockCrmId,
      data: mockPerson,
    });
  });
});
