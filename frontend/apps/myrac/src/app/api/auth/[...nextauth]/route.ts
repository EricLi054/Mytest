import type { CallbacksOptions } from "next-auth";
import setPCMCookie from "#utils/cookie/setPCMCookie";
import NextAuth from "next-auth/next";

import { authOptions, getDecodedNextAuthToken } from "@racwa/auth";

const sessionCallback: CallbacksOptions["session"] = async ({ token, session }) => {
  // Read the crmId from the token instead of calling getCrmId to avoid making an extra request
  const { extension_crmId } = getDecodedNextAuthToken(token.access_token as string);
  if (extension_crmId) {
    await setPCMCookie(extension_crmId);
  }
  if (token.expires_on) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    session.expires = token.expires_on.toString();
  }
  return session;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    session: sessionCallback,
  },
});

export { handler as GET, handler as POST };
