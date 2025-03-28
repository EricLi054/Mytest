"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { trace } from "@opentelemetry/api";
import { getSessionIds } from "#utils/getSessionIds";
import { createLogger } from "#utils/logging";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { YourVehicleFormSchema } from "./schema";

const log = createLogger(`${yourVehicle.name} (server action)`);

export async function yourVehicle(_: unknown, formData: FormData) {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("your-vehicle-form-submit-span");

  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    log(`Failed to get session IDs [${sessionIdsResult.error}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const submission = parseWithZod(formData, {
    schema: YourVehicleFormSchema,
  });

  if (submission.status !== "success") {
    log("Form submission failed validation");
    span.end();
    return submission.reply();
  }

  const getSessionResult = await getUpdateYourVehicleSession({ currentPage: "/your-vehicle", crmId, sessionId });

  if (!getSessionResult.success) {
    log(`Failed to get session, redirectTo: [${getSessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }));
  }

  const { session } = getSessionResult;

  session.steps.yourVehicle = submission.value;
  const setSessionResult = await setUpdateYourVehicleSession({ session, crmId, sessionId });

  if (!setSessionResult.success) {
    log(`Failed to update session, redirectTo [${setSessionResult.redirectTo}]`);
    span.end();
    redirect(getUpdateYourVehiclePageUrl({ page: setSessionResult.redirectTo }));
  }

  log("Successfully updated session with YourVehicleForm data, redirecting to /update-vehicle");

  span.end();
  redirect(getUpdateYourVehiclePageUrl({ page: "/update-vehicle" }));
}

export type YourVehicleAction = typeof yourVehicle;
