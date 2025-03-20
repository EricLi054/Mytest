"use server";

import type { z } from "zod";
import { getCrmId } from "#utils/session/getCrmId";

import { getCacheFor } from "@racwa/cache";

import type { RawPersonSchema } from "../queries/schema";

const personCachePrefix = "PERSON";

const absoluteTtlMillis = 300_000; // 5 minutes in milliseconds
const slidingTtlMillis = 60_000; // 1 minute in milliseconds

export type PersonCache = z.infer<typeof RawPersonSchema> | null;

export const upsertPersonCache = async (person: PersonCache) => {
  const personCache = getCacheFor<PersonCache>({ instanceName: personCachePrefix });

  const crmId = await getCrmId();
  if (!crmId) {
    return false;
  }

  const { success: hasCache } = await personCache.get({ cacheKey: crmId });

  if (hasCache) {
    const { success } = await personCache.set({
      cacheKey: crmId,
      data: person,
    });

    return success;
  } else {
    const { success } = await personCache.create({
      cacheKey: crmId,
      data: person,
      absoluteTtlMillis,
      slidingTtlMillis,
    });

    return success;
  }
};

export const getPersonCache = async () => {
  const personCache = getCacheFor<PersonCache>({ instanceName: personCachePrefix });

  const crmId = await getCrmId();
  if (!crmId) {
    return null;
  }

  const cachedResult = await personCache.get({ cacheKey: crmId });

  return cachedResult.success ? cachedResult.value : null;
};

export const invalidatePersonCache = async () => {
  const personCache = getCacheFor<PersonCache>({ instanceName: personCachePrefix });

  const crmId = await getCrmId();
  if (!crmId) {
    return null;
  }

  const { success } = await personCache.set({ cacheKey: crmId, data: null });

  return success;
};
