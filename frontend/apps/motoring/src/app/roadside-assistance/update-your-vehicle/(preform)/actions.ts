"use server";

import { cookies } from "next/headers";
import { trace } from "@opentelemetry/api";
import { uyvSessionIdCookieName } from "#constants";
import { checkHealth } from "#utils/checkHealth";
import { getCrmId } from "#utils/getCrmId";
import { createLogger } from "#utils/logging";

import type { UpdateYourVehicleErrorPage, UpdateYourVehicleFormPage } from "../routing";
import { createUpdateYourVehicleSession } from "../UpdateYourVehicleSession";
import { getRoadsideProductData } from "./data";

export type CreateSessionArgs = {
  productHoldingHeaderId: string | undefined;
  productHoldingLineId: string | undefined;
};

type CreateSessionReturn = {
  redirectTo:
    | Extract<UpdateYourVehicleFormPage, "/your-vehicle">
    | Extract<
        UpdateYourVehicleErrorPage,
        "/change-already-made" | "/product-update-not-allowed" | "/system-unavailable"
      >;
};

const log = createLogger(`${createSession.name} (server action)`);

export async function createSession({
  productHoldingHeaderId,
  productHoldingLineId,
}: CreateSessionArgs): Promise<CreateSessionReturn> {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("create-session-span");
  const queryParamDetails = `productHoldingHeaderId [${productHoldingHeaderId}], productHoldingLineId: [${productHoldingLineId}]`;

  const cookieStore = await cookies();
  cookieStore.delete(uyvSessionIdCookieName);

  if (!productHoldingHeaderId || !productHoldingLineId) {
    log(`Invalid query params, redirecting to /system-unavailable (${queryParamDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  const crmId = await getCrmId();

  if (!crmId) {
    log("CRM ID not found in request, redirecting to /system-unavailable");
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  const {
    data: { me: member, serviceIsAlive },
    errors,
  } = await getRoadsideProductData({ productId: productHoldingHeaderId, lineId: productHoldingLineId });

  const requestDetails = `crmId [${crmId}], ${queryParamDetails}`;

  if (errors) {
    log(`Failed to retrieve roadside product, redirecting to /system-unavailable (${requestDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  const checkHealthResult = checkHealth(serviceIsAlive);

  if (!checkHealthResult.success) {
    checkHealthResult.deadServices.forEach((service) =>
      log(`${service} is not alive, redirecting to /system-unavailable (${requestDetails})`),
    );
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  span.addEvent("All services are operational");

  if (!member) {
    log(`Member data missing, redirecting to /system-unavailable (${requestDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  if (!member.roadsideProduct) {
    log(`Roadside product missing, redirecting to /system-unavailable (${requestDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  const { roadsideProduct } = member;

  if (!roadsideProduct.isActive) {
    log(`Roadside product is not active, redirecting to /system-unavailable (${requestDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  if (!roadsideProduct.line) {
    log(`Roadside product line missing, redirecting to /system-unavailable (${requestDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  const { line } = roadsideProduct;

  if (!line.canUpdateVehicle) {
    switch (line.canUpdateVehicleReason) {
      case "VEHICLE_CHANGE_LIMIT_REACHED": {
        log(`Vehicle change limit reached, redirecting to /change-already-made (${requestDetails})`);
        span.end();
        return { redirectTo: "/change-already-made" };
      }

      case "REGO_ONLY_CHANGE_ALLOWED": {
        log(`Rego only change allowed, redirecting to /product-update-not-allowed (${requestDetails})`);
        span.end();
        return { redirectTo: "/product-update-not-allowed" };
      }

      case "PRODUCT_NOT_ENABLED": {
        const page = line.productType === "OTHER" ? "/system-unavailable" : "/product-update-not-allowed";
        log(`Product not enabled [${line.productType}], redirecting to ${page} (${requestDetails})`);
        span.end();
        return { redirectTo: page };
      }

      default: {
        log(
          `Vehicle cannot be updated for reason [${line.canUpdateVehicleReason}], redirecting to /system-unavailable (${requestDetails})`,
        );
        span.end();
        return { redirectTo: "/system-unavailable" };
      }
    }
  }

  const { vehicleDetail } = line;

  if (!vehicleDetail) {
    log(`Vehicle details missing from roadside product line, redirecting to /system-unavailable (${requestDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  log(`Creating UpdateYourVehicle session for ${requestDetails}`);

  const createSessionResult = await createUpdateYourVehicleSession({
    crmId,
    firstName: member.firstName,
    productHoldingHeaderId,
    productHoldingLineId,
    currentVehicleDetails: vehicleDetail,
  });

  if (!createSessionResult.success) {
    log(`Failed to create session, redirecting to /system-unavailable (${requestDetails})`);
    span.end();
    return { redirectTo: "/system-unavailable" };
  }

  const { sessionId } = createSessionResult;

  log(`Successfully created UpdateYourVehicle session with ID ${sessionId} for ${requestDetails}`);

  cookieStore.set(uyvSessionIdCookieName, sessionId, {
    // see: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#cookies
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  span.end();
  return { redirectTo: "/your-vehicle" };
}
