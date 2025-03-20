import "server-only";

import { trace } from "@opentelemetry/api";

import { getDecodedNextAuthToken } from "@racwa/auth";

import { getAccessToken } from "./getAccessToken";

export async function getCrmId(): Promise<string | undefined> {
  try {
    const tracer = trace.getTracer("default");
    const span = tracer.startSpan("get-crmid-span");

    const accessToken = await getAccessToken();
    const { extension_crmId } = getDecodedNextAuthToken(accessToken);

    span.setAttribute("crmId", extension_crmId ?? "");
    span.end();
    return extension_crmId;
  } catch {
    return undefined;
  }
}
