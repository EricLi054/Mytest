"use server";

import { headers } from "next/headers";
import { serverEnv } from "#env/server";

import { NpeOtpFeatureHeaders } from "@racwa/mfa/types";

/**
 * Get the NPE feature headers from the headerStore for the current
 * request when the containerAppEnv is an non-production environment:
 * - BypassOtp: If true, the MFA OTP will be bypassed.
 * - OverrideToNumber: If set, the MFA OTP will be sent to this number.
 *
 * If a header is not found in the headerStore, the default value will be used.
 *
 * If the containerAppEnv is not a non-production environment, undefined will be returned.
 *
 * Outstanding:
 * - TODO - DED-2230 - Should this be moved to mfa package for reuse across the frontend apps?
 * - TODO - DED-2230 - Should these only be set in NPE or just add them regardless of env?
 * - TODO - DED-2230 - Should these be set at an env config level or on a per request basis?
 * - TODO - DED-2230 - Should this check request headers first then get the feature toggles from GQL?
 * - TODO - DED-2230 - https://rac-wa.atlassian.net/wiki/spaces/PDP/pages/4053729494/Should+MFA+OTP+NPE+Feature+Headers+be+set+at+an+environment+config+level+or+at+a+request+level
 * - TODO - DED-2230 - https://rac-wa.atlassian.net/wiki/spaces/PDP/pages/4034822228/Should+UAT+be+allowed+to+set+the+RACI+MFA+OTP+NPE+Feature+Toggles+to+bypass+OTP+and+set+the+override+number
 */
export async function getNpeFeatureHeaders(correlationId: string): Promise<Record<string, string>> {
  const npeHeaders: Record<string, string> = {};
  const npeContainerAppEnvs = ["local", "dev", "sit", "uat"];
  const containerAppEnv = serverEnv().CONTAINER_APP_ENV.toLowerCase();

  if (npeContainerAppEnvs.includes(containerAppEnv)) {
    const headerStore = await headers();
    npeHeaders[NpeOtpFeatureHeaders.BypassOtp] = headerStore.get(NpeOtpFeatureHeaders.BypassOtp) ?? "true";
    npeHeaders[NpeOtpFeatureHeaders.OverrideToNumber] = headerStore.get(NpeOtpFeatureHeaders.OverrideToNumber) ?? "";

    const npeHeadersToLog = Object.entries(npeHeaders)
      .map(([key, value]) => `[${key}: ${value}]`)
      .join(", ");
    console.log(`NPE Feature Headers for request with CorrelationId [${correlationId}]: ${npeHeadersToLog}`);
  }

  return npeHeaders;
}
