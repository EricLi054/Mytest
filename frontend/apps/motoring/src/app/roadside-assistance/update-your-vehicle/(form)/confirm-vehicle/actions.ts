"use server";

import { redirect } from "next/navigation";
import { trace } from "@opentelemetry/api";
import { getSessionIds } from "#utils/getSessionIds";
import { createLogger } from "#utils/logging";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { updateRoadsideVehicle } from "./data";

const log = createLogger(`${confirmVehicle.name} (server action)`);

export async function confirmVehicle() {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("confirm-vehicle-form-submit-span");

  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    log(`Failed to get session IDs [${sessionIdsResult.error}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const getSessionResult = await getUpdateYourVehicleSession({ currentPage: "/confirm-vehicle", crmId, sessionId });

  if (!getSessionResult.success) {
    log(`Failed to get session, redirectTo: [${getSessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }));
  }

  const { session } = getSessionResult;

  if (!session.steps.updateVehicle || !session.searchedVehicleDetails) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const result = await updateRoadsideVehicle({
    productId: session.productHoldingHeaderId,
    lineId: session.productHoldingLineId,
    newVehicleDetail: { ...session.searchedVehicleDetails, color: session.steps.updateVehicle.vehicleColour },
  });

  if (result.errors) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  session.steps.confirmVehicle = { vehicleUpdated: true };
  const setSessionResult = await setUpdateYourVehicleSession({ session, crmId, sessionId });

  if (!setSessionResult.success) {
    log(`Failed to update session, redirectTo [${setSessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: setSessionResult.redirectTo }));
  }

  span.end();
  redirect(getUpdateYourVehiclePageUrl({ page: "/confirmation" }));
}

export type ConfirmVehicleAction = typeof confirmVehicle;
