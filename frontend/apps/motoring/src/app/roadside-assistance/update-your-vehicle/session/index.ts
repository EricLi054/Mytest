import type { UpdateYourVehiclePage } from "#app/roadside-assistance/update-your-vehicle/routing";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getUpdateYourVehiclePageUrl,
  getUpdateYourVehicleTimeoutUrl,
} from "#app/roadside-assistance/update-your-vehicle/routing";
import { getCrmId } from "#utils/getCrmId";

import type { Result } from "@racwa/types";
import { DataCacheError, getCacheFor } from "@racwa/cache";

import type { UpdateYourVehicleSession } from "./types";

export const uyvSessionIdCookieName = "rac-motoring-uyv-session-id";

const sessionCachePrefix = "UYV:SESSION";

const absoluteTtlMillis = 18_000_000; // 300 minutes in milliseconds
const slidingTtlMillis = 1_800_000; // 30 minutes in milliseconds

type Action = "create" | "get" | "set";

const log = (action: Action, message: string) => console.log(`[${action}UpdateYourVehicleSession]: ${message}`);

export type CreateUpdateYourVehicleSessionArgs = Pick<
  UpdateYourVehicleSession,
  "firstName" | "productHoldingHeaderId" | "productHoldingLineId" | "currentVehicleDetails"
>;

export const createUpdateYourVehicleSession = async (
  data: CreateUpdateYourVehicleSessionArgs,
): Promise<Result<{ value: { sessionId: string } }>> => {
  const action = "create" satisfies Action;

  const crmId = await getCrmId();
  if (!crmId) {
    log(action, "Failed to create session, no CRM ID found");
    return { success: false };
  }

  const sessionDetails = `crmId [${crmId}], productHoldingHeaderId [${data.productHoldingHeaderId}], productHoldingLineId [${data.productHoldingLineId}]`;
  log(action, `Creating session for ${sessionDetails}`);

  const sessionCache = getCacheFor<UpdateYourVehicleSession>({ instanceName: sessionCachePrefix });

  // Session IDs need at least 64 bits of entropy to prevent brute-force attacks. Using hexadecimal encoding, this requires at least 16 hex characters (64 bits).
  // see: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-id-properties
  // crypto.randomUUID provides 32 hex characters (128 bits, 122 bits of entropy due to 6 fixed bits).
  // see: https://w3c.github.io/webcrypto/#Crypto-method-randomUUID
  const sessionId = crypto.randomUUID();

  const result = await sessionCache.create({
    cacheKey: sessionId,
    absoluteTtlMillis,
    slidingTtlMillis,
    data: {
      ...data,
      crmId,
      searchedVehicleDetails: undefined,
      steps: {
        yourVehicle: undefined,
        updateVehicle: undefined,
        confirmVehicle: { vehicleUpdated: false },
      },
    },
  });

  if (!result.success) {
    log("create", `Failed to create session for ${sessionDetails}. (Cache error ${result.error})`);
    return { success: false };
  }

  log("create", `Successfully created session with ID ${result.key} for ${sessionDetails}`);
  return { success: true, sessionId: result.key };
};

export const getUpdateYourVehicleSession = async ({
  currentPage,
}: {
  currentPage: UpdateYourVehiclePage["formPage"];
}): Promise<{ session: UpdateYourVehicleSession; sessionTtl: number }> => {
  const action = "get" satisfies Action;

  const sessionId = await getSessionId({ action });
  const sessionCache = getCacheFor<UpdateYourVehicleSession>({ instanceName: sessionCachePrefix });

  log(action, `Getting session with ID ${sessionId}`);
  const result = await sessionCache.get({ cacheKey: sessionId });

  if (!result.success) {
    return handleCacheError({ error: result.error, currentPage, sessionId, action });
  }

  const { value: session, ttlMillis } = result;

  await validateCrmIdInSession({ session, sessionId, action });
  validateCurrentPage({ currentPage, session, sessionId, action });

  return { session, sessionTtl: ttlMillis };
};

export const setUpdateYourVehicleSession = async ({
  session,
  currentPage,
}: {
  session: UpdateYourVehicleSession;
  currentPage: UpdateYourVehiclePage["formPage"];
}): Promise<void> => {
  const action = "set" satisfies Action;

  const sessionId = await getSessionId({ action });
  const sessionCache = getCacheFor<UpdateYourVehicleSession>({ instanceName: sessionCachePrefix });

  const getResult = await sessionCache.get({ cacheKey: sessionId });

  if (!getResult.success) {
    return handleCacheError({ error: getResult.error, currentPage, sessionId, action });
  }

  await validateCrmIdInSession({ session: getResult.value, sessionId, action });

  const setResult = await sessionCache.set({ cacheKey: sessionId, data: session });

  if (!setResult.success) {
    return handleCacheError({ error: setResult.error, currentPage, sessionId, action });
  }
};

const getSessionId = async ({ action }: { action: Action }): Promise<string> => {
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get(uyvSessionIdCookieName);

  if (!sessionIdCookie) {
    log(action, `Session ID cookie not found, redirecting to /system-unavailable`);
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  return sessionIdCookie.value;
};

const validateCrmIdInSession = async ({
  session,
  sessionId,
  action,
}: {
  session: UpdateYourVehicleSession;
  sessionId: string;
  action: Action;
}): Promise<void> => {
  const sessionDetails = `sessionId: [${sessionId}]`;

  const crmId = await getCrmId();

  if (!crmId) {
    log(action, `CRM ID not found in request, redirecting to /system-unavailable (${sessionDetails})`);
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  if (session.crmId !== crmId) {
    log(
      action,
      `CRM ID from request [${crmId}] does not match CRM ID in session [${session.crmId}], redirecting to /system-unavailable (${sessionDetails})`,
    );
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }
};

const validateCurrentPage = ({
  currentPage,
  session: { steps },
  sessionId,
  action,
}: {
  currentPage: UpdateYourVehiclePage["formPage"];
  session: UpdateYourVehicleSession;
  sessionId: string;
  action: Action;
}): void => {
  const sessionDetails = `sessionId: [${sessionId}]`;

  if (steps.confirmVehicle.vehicleUpdated) {
    if (currentPage === "/confirmation") {
      return;
    }

    log(action, `Vehicle already updated, redirecting from ${currentPage} to /confirmation (${sessionDetails})`);
    return redirect(getUpdateYourVehiclePageUrl({ page: "/confirmation" }));
  }

  if (currentPage === "/") {
    const nextPage = (
      !steps.yourVehicle ? "/your-vehicle" : !steps.updateVehicle ? "/update-vehicle" : "/confirm-vehicle"
    ) satisfies Extract<UpdateYourVehiclePage["formPage"], "/your-vehicle" | "/update-vehicle" | "/confirm-vehicle">;

    log(action, `Session in progress, redirecting from ${currentPage} to ${nextPage} (${sessionDetails})`);
    return redirect(getUpdateYourVehiclePageUrl({ page: nextPage }));
  }

  if (currentPage === "/update-vehicle" && !steps.yourVehicle) {
    log(action, `/your-vehicle is not completed, redirecting from ${currentPage} to /your-vehicle (${sessionDetails})`);
    return redirect(getUpdateYourVehiclePageUrl({ page: "/your-vehicle" }));
  }

  if (currentPage === "/confirm-vehicle" && !steps.updateVehicle) {
    log(
      action,
      `/update-vehicle is not completed, redirecting from ${currentPage} to /update-vehicle (${sessionDetails})`,
    );
    return redirect(getUpdateYourVehiclePageUrl({ page: "/update-vehicle" }));
  }

  if (currentPage === "/confirmation") {
    log(
      action,
      `Vehicle has not been updated, redirecting from ${currentPage} to /confirm-vehicle (${sessionDetails})`,
    );
    return redirect(getUpdateYourVehiclePageUrl({ page: "/confirm-vehicle" }));
  }
};

const handleCacheError = ({
  error,
  currentPage,
  sessionId,
  action,
}: {
  error: DataCacheError;
  currentPage: UpdateYourVehiclePage["formPage"];
  sessionId: string;
  action: Action;
}) => {
  if (error === DataCacheError.KeyNotFound) {
    log(action, `Session with ID [${sessionId}] not found, redirecting to /session-timeout`);
    return redirect(getUpdateYourVehicleTimeoutUrl({ previousPage: currentPage }));
  }

  log(action, `Error [${error}] getting session with ID [${sessionId}], redirecting to /system-unavailable`);
  return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
};
