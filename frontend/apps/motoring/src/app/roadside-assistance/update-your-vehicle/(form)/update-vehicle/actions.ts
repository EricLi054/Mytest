"use server";

import type { VehicleCardInfo } from "#utils/getVehicleCardInfo";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { trace } from "@opentelemetry/api";
import { getSessionIds } from "#utils/getSessionIds";
import { getVehicleCardInfo } from "#utils/getVehicleCardInfo";
import { createLogger } from "#utils/logging";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { getVehicleDetailsByRego } from "./data";
import { UpdateVehicleFormSchema } from "./schema";

export async function updateVehicle(_: unknown, formData: FormData) {
  const log = createLogger(`${updateVehicle.name} (server action)`);
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("update-vehicle-form-submit-span");

  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    log(`Failed to get session IDs [${sessionIdsResult.error}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const submission = parseWithZod(formData, {
    schema: UpdateVehicleFormSchema,
  });

  if (submission.status !== "success") {
    span.end();
    return submission.reply();
  }

  const getSessionResult = await getUpdateYourVehicleSession({ currentPage: "/update-vehicle", crmId, sessionId });

  if (!getSessionResult.success) {
    log(`Failed to get session, redirectTo: [${getSessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }));
  }

  const { session } = getSessionResult;

  if (!session.searchedVehicleDetails) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  session.steps.updateVehicle = submission.value;
  const setSessionResult = await setUpdateYourVehicleSession({ session, crmId, sessionId });

  if (!setSessionResult.success) {
    log(`Failed to update session, redirectTo [${setSessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: setSessionResult.redirectTo }));
  }

  span.end();
  redirect(getUpdateYourVehiclePageUrl({ page: "/confirm-vehicle" }));
}

type GetVehicleByRegoArgs = Omit<Parameters<typeof getVehicleDetailsByRego>[0]["vehicleByRego"], "state">;

export async function getVehicleByRego({
  vehicleType,
  registrationNumber,
}: GetVehicleByRegoArgs): Promise<VehicleCardInfo | undefined> {
  const log = createLogger(`${getVehicleByRego.name} (server action)`);
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("update-vehicle-get-vehicle-by-rego-span");

  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    log(`Failed to get session IDs [${sessionIdsResult.error}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const sessionResult = await getUpdateYourVehicleSession({ currentPage: "/update-vehicle", crmId, sessionId });

  if (!sessionResult.success) {
    log(`Failed to get session, redirectTo: [${sessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: sessionResult.redirectTo }));
  }

  const { session } = sessionResult;

  const { data, errors } = await getVehicleDetailsByRego({
    vehicleByRego: { vehicleType, registrationNumber, state: "WA" },
  });

  if (errors) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  if (!data.vehicleByRego) {
    span.end();
    return undefined;
  }

  const vehicleCardInfo = getVehicleCardInfo(data.vehicleByRego);

  if (!vehicleCardInfo.success) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  session.searchedVehicleDetails = { ...data.vehicleByRego, vehicleType };
  const setSessionResult = await setUpdateYourVehicleSession({ session, crmId, sessionId });

  if (!setSessionResult.success) {
    log(`Failed to update session, redirectTo [${setSessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: setSessionResult.redirectTo }));
  }

  span.end();
  return vehicleCardInfo;
}

export type UpdateVehicleAction = typeof updateVehicle;
export type GetVehicleByRegoAction = typeof getVehicleByRego;
