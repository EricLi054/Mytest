import type { matchSchema } from "#app/register/(register)/match/schema";
import type { Person } from "#app/register/(register)/match/types/index";
import type { beforeYouStartSchema } from "#app/register/(register)/schema";
import type { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { annotatedLog } from "#utils/logging";
import { getServerSession } from "next-auth";

import { DataCacheError, getCacheFor } from "@racwa/cache";

import type { RegistrationPage } from "./routing";
import { getRegistrationErrorPageUrl } from "./routing";

export const SESSION_COOKIE_NAME = "identity-session-id";
export const MAX_MATCH_ATTEMPTS = 3;

const sessionCachePrefix = "REGISTER:SESSION";

const absoluteTtlMillis = 18_000_000; // 300 minutes in milliseconds
const slidingTtlMillis = 1_800_000; // 30 minutes in milliseconds

export type RegistrationSession = {
  id: string | undefined;
  redirectUrl: string | undefined;
  person: Person | undefined;
  incorrectMatchAttempts: number;
  steps: {
    beforeYouStart: z.infer<typeof beforeYouStartSchema> | undefined;
    match: z.infer<typeof matchSchema> | undefined;
  };
};

export const initialSession = {
  id: undefined,
  redirectUrl: undefined,
  person: undefined,
  incorrectMatchAttempts: 0,
  steps: {
    beforeYouStart: { hasAcceptedTerms: true },
    match: undefined,
  },
} as const satisfies RegistrationSession;

/**
 * TODO - DED-2331 - myRAC does this, but it is always returning null session here and in the root layout
 */
export const ensureServerSession = async () => {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
};

export const createRegistrationSession = async (redirectUrl?: string) => {
  const log = (message: string, sessionId?: string) => annotatedLog("createRegistrationSession", message, sessionId);

  const sessionCache = getCacheFor<RegistrationSession>({ instanceName: sessionCachePrefix });
  log("Creating a new session in Redis");
  log(`Custom redirect requested: ${redirectUrl ?? "-"}`);

  /**
   * Session IDs need at least 64 bits of entropy to prevent brute-force attacks. Using hexadecimal encoding, this requires at least 16 hex characters (64 bits).
   * see: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-id-properties
   * crypto.randomUUID provides 32 hex characters (128 bits, 122 bits of entropy due to 6 fixed bits).
   * see: https://w3c.github.io/webcrypto/#Crypto-method-randomUUID
   */
  const sessionId = crypto.randomUUID();

  const result = await sessionCache.create({
    cacheKey: sessionId,
    data: { ...initialSession, id: sessionId, redirectUrl },
    absoluteTtlMillis,
    slidingTtlMillis,
  });

  if (!result.success) {
    log(`Failed to create session: ${result.error}`);
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }

  log("Successfully created session", result.key);
  return result.key;
};

export const getRegistrationSession = async ({
  currentPage,
}: {
  currentPage: RegistrationPage["formPage"];
}): Promise<RegistrationSession> => {
  const log = (message: string, sessionId?: string, crmId?: string) =>
    annotatedLog("getRegistrationSession", message, sessionId, crmId);

  const sessionCache = getCacheFor<RegistrationSession>({ instanceName: sessionCachePrefix });
  const sessionId = await getSessionId();

  log("Getting existing session", sessionId);
  const result = await sessionCache.get({ cacheKey: sessionId });

  if (!result.success) {
    log(`Failed to get session: ${result.error}`);
    return redirect(getRegistrationErrorPageUrl({ page: "/session-timeout" }));
  }

  log("Successfully retrieved session", sessionId, result.value.person?.personId);
  const session = result.value;

  validateCurrentPage({ currentPage, session });

  return session;
};

export const updateRegistrationSession = async ({ session }: { session: RegistrationSession }) => {
  const log = (message: string, sessionId?: string, crmId?: string) =>
    annotatedLog("updateRegistrationSession", message, sessionId, crmId);

  const sessionCache = getCacheFor<RegistrationSession>({ instanceName: sessionCachePrefix });
  const sessionId = await getSessionId();
  const crmId = session.person?.personId;

  log("Getting session to update", sessionId, crmId);
  const result = await sessionCache.get({ cacheKey: sessionId });

  if (!result.success) {
    log(`Failed to get session: ${result.error}`, sessionId);
    return redirect(getRegistrationErrorPageUrl({ page: "/session-timeout" }));
  }

  log("Updating session", sessionId, crmId);
  const setResult = await sessionCache.set({ cacheKey: sessionId, data: session });

  if (!setResult.success) {
    log(`Failed to update session: ${setResult.error}`, sessionId, crmId);
    if (setResult.error === DataCacheError.KeyNotFound) {
      return redirect(getRegistrationErrorPageUrl({ page: "/session-timeout" }));
    }
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }

  log("Successfully updated session", sessionId, crmId);
};

export const getSessionId = async (): Promise<string> => {
  const log = (message: string, sessionId?: string) => annotatedLog("getSessionId", message, sessionId);

  const cookieStore = await cookies();

  log("Getting session from cookie");
  const sessionIdCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionIdCookie) {
    log("Failed to find session cookie");
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }

  log("Found session cookie", sessionIdCookie.value);
  return sessionIdCookie.value;
};

export const validateCurrentPage = ({
  currentPage,
  session,
}: {
  currentPage: RegistrationPage["formPage"];
  session: RegistrationSession;
}): void => {
  const log = (message: string) => annotatedLog("validateCurrentPage", message, session.id, session.person?.personId);

  log(`Validating session can navigate to: ${currentPage}`);

  // Should redirect to the relevant error page if a number of attempts has been exceeded
  if (session.incorrectMatchAttempts >= MAX_MATCH_ATTEMPTS) {
    log(`Allowed incorrect match attempts exceeded: ${session.incorrectMatchAttempts}`);
    return redirect(getRegistrationErrorPageUrl({ page: "/cant-find-you" }));
  }

  // TODO - DED-1296 - add MFA completed check, TTL of the session needs to be considered so that they do not stay authenticated outside the 10 min OTP Service authenticated timeframe
};

// Extract and validate a redirection URL passed in as a query string
export function extractRedirectUrl(
  referer: string | null,
  validHosts: string[],
  log: (message: string) => void,
): string | undefined {
  if (!referer) {
    log("No referer provided");
    return undefined;
  }

  try {
    const referringUrl = new URL(referer);

    const queryParams = new URLSearchParams(referringUrl.search);
    const redirectUrlQueryParam = queryParams.get("redirectUrl") ?? undefined;

    if (!redirectUrlQueryParam) {
      log("No redirect URL requested");
      return undefined;
    }

    const redirectUrl = new URL(redirectUrlQueryParam);
    if (validHosts.includes(redirectUrl.host)) {
      log(`Redirect URL ${redirectUrlQueryParam} matched allowed hosts exactly`);
      return redirectUrlQueryParam;
    }

    // We will allow a redirect to rac.com.au or insurance.rac.com.au, for example
    const urlParts = redirectUrl.host.split(".");
    urlParts.shift();
    const redirectWithSubDomain = urlParts.join(".");

    if (validHosts.includes(redirectWithSubDomain)) {
      log(`Redirect URL ${redirectUrlQueryParam} with subdomain matched allowed hosts`);
      return redirectUrlQueryParam;
    }

    log(`Redirect URL ${redirectUrl} did not match allowed hosts`);
    return undefined;
  } catch {
    log(`Failed to parse ${referer}`);
    return undefined;
  }
}
