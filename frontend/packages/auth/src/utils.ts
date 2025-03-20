import type { CallbacksOptions, TokenSet } from "next-auth";

import { getADB2CTokenEndpoint } from "./adb2c";

export function getDecodedToken(token: string): {
  email?: string;
  crmid?: string;
} {
  const decoded = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64").toString()) as {
    email: string;
    extension_crmId: string;
  };
  return { email: decoded.email, crmid: decoded.extension_crmId };
}

async function getAccessToken(code: string, refresh: boolean) {
  const tokenEndpoint = await getADB2CTokenEndpoint(refresh);

  const body = new URLSearchParams({
    grant_type: refresh ? "refresh_token" : "authorization_code",
    client_id: process.env.AZURE_AD_B2C_CLIENT_ID ?? "",
    client_secret: process.env.AZURE_AD_B2C_CLIENT_SECRET ?? "",
    ...(refresh ? { refresh_token: code } : { code }),
    scope: `${process.env.AZURE_AD_B2C_CLIENT_ID} offline_access openid profile`,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    console.error(`Error: getAccessToken.js - Code: ${response.status} Body: ${JSON.stringify(response.body)}`);
    throw new Error(`Error getting access token: ${response.statusText}`);
  }

  return response.json() as unknown as TokenSet | null;
}

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface JWT {
    refresh_token?: string;
    access_token?: string;
  }
}

export const jwtCallback: CallbacksOptions["jwt"] = async ({ token, account, trigger, session }) => {
  try {
    // TOO HARD TO GET THE TYPE OF session.code as next-auth does not provide the type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const code = session?.code as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const refresh = session?.refresh as boolean;
    // Update trigger when we update the email
    if (trigger === "update") {
      if (code && typeof code === "string") {
        const tokens = await getAccessToken(code, false);
        if (tokens) {
          if (tokens.access_token) {
            // need to decode the access token to update the email address that is used on client side
            const { email } = getDecodedToken(tokens.access_token);
            token.name = email;
            token.email = email;
            token.access_token = tokens.access_token;
          }
          token.refresh_token = tokens.refresh_token ?? token.refresh_token;
          token.expires_on = tokens.expires_on ? (tokens.expires_on as number) * 1000 : token.expires_on;
        }
      }
      if (refresh && token.refresh_token) {
        const refreshToken = token.refresh_token as string;
        const tokens = await getAccessToken(refreshToken, true);
        if (tokens) {
          token.access_token = tokens.access_token;
          token.refresh_token = tokens.refresh_token ?? token.refresh_token;
          token.expires_on = (tokens.expires_on as number) * 1000;
        }
      }
    } else {
      // If the user has just signed in, create a new token
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_on = (account.expires_on as number) * 1000;
      }

      // If token expired, try to refresh it starting 10 minutes before it expires
      const tenMinutesBeforeExpiry = (token.expires_on as number) - 10 * 60000;
      const twoMinutesBeforeExpiry = (token.expires_on as number) - 2 * 60000;
      if (token.refresh_token && Date.now() > tenMinutesBeforeExpiry && Date.now() < twoMinutesBeforeExpiry) {
        const tokens = await getAccessToken(token.refresh_token as string, true);
        if (tokens) {
          token.access_token = tokens.access_token;
          token.refresh_token = tokens.refresh_token ?? token.refresh_token;
          token.expires_on = (tokens.expires_on as number) * 1000;
        }
      }
    }

    return token;
  } catch (error) {
    console.error("Error: getAccessToken.js - Error getting token.", error);
    throw new Error("JWT Callback error");
  }
};
