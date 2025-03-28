import type { uyvSessionIdCookieName } from "#constants";
import { cookies } from "next/headers";

import type { Result } from "@racwa/types";

import { getCrmId } from "./getCrmId";

export async function getSessionIds({
  cookieName,
}: {
  cookieName: typeof uyvSessionIdCookieName;
}): Promise<Result<{ value: { crmId: string; sessionId: string }; error: "Missing CRM ID" | "Missing session ID" }>> {
  const crmId = await getCrmId();

  if (!crmId) {
    return { success: false, error: "Missing CRM ID" };
  }

  const sessionId = (await cookies()).get(cookieName)?.value;

  if (!sessionId) {
    return { success: false, error: "Missing session ID" };
  }

  return { success: true, crmId, sessionId };
}
