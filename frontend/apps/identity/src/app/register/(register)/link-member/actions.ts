"use server";

import { redirect } from "next/navigation";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { annotatedLog } from "#utils/logging";
import { getRegistrationErrorPageUrl } from "#utils/routing";
import { getRegistrationSession } from "#utils/session";

import { getDecodedNextAuthToken, getNextAuthAccessToken } from "@racwa/auth";

import { UpdateADB2CAccountCrmId } from "./data";

/**
 * Links together the previously matched member from the session with the ADB2C
 * record from the NextAuth access token.
 */
export async function linkMemberAction() {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("link-member-span");
  const log = (message: string, sessionId?: string, crmId?: string) =>
    annotatedLog("linkMemberAction", message, sessionId, crmId);

  log("Attempting to link member in ADB2C");

  const { NEXTAUTH_URL, NEXTAUTH_SECRET, MY_RAC_HOMEPAGE_URL } = serverEnv();

  const session = await getRegistrationSession({ currentPage: "/link-member" });
  const accessToken = await getNextAuthAccessToken(NEXTAUTH_URL, NEXTAUTH_SECRET);
  const { sub: adb2cAccountId } = getDecodedNextAuthToken(accessToken);
  const crmId = session.person?.personId;

  log(`Member is logged in as ADB2C Object: ${adb2cAccountId ?? "-"}`, session.id, crmId);

  if (!adb2cAccountId || !crmId) {
    log(`Missing required linking data for ADB2C Object: ${adb2cAccountId ?? "-"}`, session.id, crmId);
    span.end();
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }

  log("Performing member linking", session.id, crmId);

  const result = await UpdateADB2CAccountCrmId({ crmId, adb2cAccountId }, accessToken);

  if (result.data.updateAdAccountCrmId?.isSuccessful) {
    const redirectUrl = session.redirectUrl ?? MY_RAC_HOMEPAGE_URL;

    log(`Successfully completed linking. Redirecting to: ${redirectUrl}`, session.id, crmId);

    span.end();
    return redirect(redirectUrl);
  } else {
    log("Failed to link member", session.id, crmId);
    span.end();
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }
}
