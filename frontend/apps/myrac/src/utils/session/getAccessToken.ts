import "server-only";

import { serverEnv } from "#env/server";

import { getNextAuthAccessToken } from "@racwa/auth";

export async function getAccessToken(): Promise<string> {
  const { NEXTAUTH_URL, NEXTAUTH_SECRET } = serverEnv();

  return await getNextAuthAccessToken(NEXTAUTH_URL, NEXTAUTH_SECRET);
}
