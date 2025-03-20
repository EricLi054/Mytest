import "server-only";

import { serverEnv } from "#env/server";

import { getDecodedNextAuthToken, getNextAuthAccessToken } from "@racwa/auth";

export async function getCrmId(): Promise<string | undefined> {
  const { NEXTAUTH_URL, NEXTAUTH_SECRET } = serverEnv();

  const token = await getNextAuthAccessToken(NEXTAUTH_URL, NEXTAUTH_SECRET);
  const { extension_crmId } = getDecodedNextAuthToken(token);

  return extension_crmId;
}
