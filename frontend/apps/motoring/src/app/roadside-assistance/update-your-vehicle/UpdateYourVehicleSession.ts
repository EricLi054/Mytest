import type {
  UpdateYourVehicleErrorPage,
  UpdateYourVehicleFormPage,
} from "#app/roadside-assistance/update-your-vehicle/routing";
import type { z } from "zod";
import { createLogger } from "#utils/logging";

import type { Result } from "@racwa/types";
import { DataCacheError, getCacheFor } from "@racwa/cache";

import type { UpdateVehicleFormSchema } from "./(form)/update-vehicle/schema";
import type { YourVehicleFormSchema } from "./(form)/your-vehicle/schema";
import type { SearchedVehicleDetail, VehicleDetail } from "./types";

export type UpdateYourVehicleSession = {
  readonly crmId: string;
  readonly firstName: string;
  readonly productHoldingHeaderId: string;
  readonly productHoldingLineId: string;
  readonly currentVehicleDetails: Readonly<VehicleDetail>;
  searchedVehicleDetails: Readonly<SearchedVehicleDetail> | undefined;
  steps: {
    yourVehicle: z.infer<typeof YourVehicleFormSchema> | undefined;
    updateVehicle: z.infer<typeof UpdateVehicleFormSchema> | undefined;
    confirmVehicle: { vehicleUpdated: boolean };
  };
};

const config = {
  cachePrefix: "UYV:SESSION",
  absoluteTtlMillis: 18_000_000, // 300 minutes in milliseconds
  slidingTtlMillis: 1_800_000, // 30 minutes in milliseconds
} as const;

export const createUpdateYourVehicleSession = async (
  session: Pick<
    UpdateYourVehicleSession,
    "crmId" | "firstName" | "productHoldingHeaderId" | "productHoldingLineId" | "currentVehicleDetails"
  >,
): Promise<Result<{ value: { sessionId: string } }>> => {
  const log = createLogger(createUpdateYourVehicleSession.name);
  const sessionCache = getCacheFor<UpdateYourVehicleSession>({ instanceName: config.cachePrefix });

  const sessionDetails = `crmId [${session.crmId}], productHoldingHeaderId [${session.productHoldingHeaderId}], productHoldingLineId [${session.productHoldingLineId}]`;

  log(`Creating session for ${sessionDetails}`);

  const result = await sessionCache.create({
    cacheKey: crypto.randomUUID(), // see: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-id-properties
    absoluteTtlMillis: config.absoluteTtlMillis,
    slidingTtlMillis: config.slidingTtlMillis,
    data: {
      ...session,
      searchedVehicleDetails: undefined,
      steps: {
        yourVehicle: undefined,
        updateVehicle: undefined,
        confirmVehicle: { vehicleUpdated: false },
      },
    },
  });

  if (!result.success) {
    log(`Failed to create session for ${sessionDetails}. (Cache error ${result.error})`);
    return { success: false };
  }

  log(`Successfully created session with ID ${result.key} for ${sessionDetails}`);
  return { success: true, sessionId: result.key };
};

export const getUpdateYourVehicleSession = async ({
  sessionId,
  crmId,
  currentPage,
}: {
  sessionId: string;
  crmId: string;
  currentPage: UpdateYourVehicleFormPage;
}): Promise<
  Result<{
    value: { session: UpdateYourVehicleSession; sessionTtl: number };
    error: {
      redirectTo:
        | UpdateYourVehicleFormPage
        | Extract<UpdateYourVehicleErrorPage, "/session-timeout" | "/system-unavailable">;
    };
  }>
> => {
  const log = createLogger(getUpdateYourVehicleSession.name);
  const sessionCache = getCacheFor<UpdateYourVehicleSession>({ instanceName: config.cachePrefix });

  log(`Getting session with ID ${sessionId}`);

  const getSessionResult = await sessionCache.get({ cacheKey: sessionId });

  if (!getSessionResult.success) {
    log(`Session with ID [${sessionId}] not found`);
    return { success: false, redirectTo: "/session-timeout" };
  }

  const { value: session, ttlMillis } = getSessionResult;

  if (crmId !== session.crmId) {
    log(`CRM ID [${crmId}] does not match CRM ID [${session.crmId}] in session with ID [${sessionId}]`);
    return { success: false, redirectTo: "/system-unavailable" };
  }

  const validatePageResult = validateCurrentPage({ currentPage, session });

  if (!validatePageResult.success) {
    log(
      `Failed to validate current page [${currentPage}] for reason [${validatePageResult.error}], redirectTo [${validatePageResult.redirectTo}]`,
    );
    return { success: false, redirectTo: validatePageResult.redirectTo };
  }

  return { success: true, session, sessionTtl: ttlMillis };
};

export const setUpdateYourVehicleSession = async ({
  sessionId,
  crmId,
  session,
}: {
  sessionId: string;
  crmId: string;
  session: UpdateYourVehicleSession;
}): Promise<
  Result<{
    error: {
      redirectTo: Extract<UpdateYourVehicleErrorPage, "/session-timeout" | "/system-unavailable">;
    };
  }>
> => {
  const log = createLogger(setUpdateYourVehicleSession.name);
  const sessionCache = getCacheFor<UpdateYourVehicleSession>({ instanceName: config.cachePrefix });

  log(`Getting session with ID ${sessionId}`);
  const getSessionResult = await sessionCache.get({ cacheKey: sessionId });

  if (!getSessionResult.success) {
    log(`Session with ID [${sessionId}] not found`);
    return { success: false, redirectTo: "/session-timeout" };
  }

  if (crmId !== session.crmId) {
    log(`CRM ID [${crmId}] does not match CRM ID [${session.crmId}] in session with ID [${sessionId}]`);
    return { success: false, redirectTo: "/system-unavailable" };
  }

  log(`Setting session with ID ${sessionId}`);
  const setSessionResult = await sessionCache.set({ cacheKey: sessionId, data: session });

  if (!setSessionResult.success) {
    if (setSessionResult.error === DataCacheError.KeyNotFound) {
      log(`Session with ID [${sessionId}] not found`);
      return { success: false, redirectTo: "/session-timeout" };
    }

    log(`Failed to update session with ID [${sessionId}] for reason [${setSessionResult.error}]`);
    return { success: false, redirectTo: "/system-unavailable" };
  }

  return { success: true };
};

type CurrentPageValidationError =
  | {
      error: "Vehicle already updated";
      redirectTo: Extract<UpdateYourVehicleFormPage, "/confirmation">;
    }
  | {
      error: "Previous page not completed";
      redirectTo: Extract<UpdateYourVehicleFormPage, "/your-vehicle" | "/update-vehicle" | "/confirm-vehicle">;
    };

const validateCurrentPage = ({
  currentPage,
  session: { steps },
}: {
  currentPage: UpdateYourVehicleFormPage;
  session: UpdateYourVehicleSession;
}): Result<{ error: CurrentPageValidationError }> => {
  if (steps.confirmVehicle.vehicleUpdated && currentPage !== "/confirmation") {
    return { success: false, error: "Vehicle already updated", redirectTo: "/confirmation" };
  }

  const previousPageNotCompleted =
    (currentPage === "/update-vehicle" && !steps.yourVehicle) ||
    (currentPage === "/confirm-vehicle" && !steps.updateVehicle) ||
    (currentPage === "/confirmation" && !steps.confirmVehicle.vehicleUpdated);

  if (previousPageNotCompleted) {
    return {
      success: false,
      error: "Previous page not completed",
      redirectTo: !steps.yourVehicle ? "/your-vehicle" : !steps.updateVehicle ? "/update-vehicle" : "/confirm-vehicle",
    };
  }

  return { success: true };
};
