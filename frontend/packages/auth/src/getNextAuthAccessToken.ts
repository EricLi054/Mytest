import "server-only";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function getNextAuthAccessToken(nextAuthUrl: string, nextAuthSecret: string): Promise<string> {
  try {
    const cookieName = nextAuthUrl.startsWith("https://")
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName);
    const decoded = await decode({ token: token?.value, secret: nextAuthSecret });
    return (decoded?.access_token ?? "") as string;
  } catch {
    return "";
  }
}
