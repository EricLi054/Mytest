"use server";

import { redirect } from "next/navigation";
import { trace } from "@opentelemetry/api";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../session";
import { updateRoadsideVehicle } from "./data";

export async function confirmVehicle() {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("confirm-vehicle-form-submit-span");
  const currentPage = "/confirm-vehicle";

  const { session } = await getUpdateYourVehicleSession({ currentPage });

  if (!session.searchedVehicleDetails || !session.steps.updateVehicle) {
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
  await setUpdateYourVehicleSession({ session, currentPage });

  span.end();
  redirect(getUpdateYourVehiclePageUrl({ page: "/confirmation" }));
}

export type ConfirmVehicleAction = typeof confirmVehicle;
