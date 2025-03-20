import type { AuthOptions, NextAuthOptions } from "next-auth";
import type { AzureB2CProfile } from "next-auth/providers/azure-ad-b2c";
import AzureADB2C from "next-auth/providers/azure-ad-b2c";

import { jwtCallback } from "./utils";

export * from "./getDecodedNextAuthToken";
export * from "./getNextAuthAccessToken";
export * from "./utils";

const clientId = process.env.AZURE_AD_B2C_CLIENT_ID ?? "";
const clientSecret = process.env.AZURE_AD_B2C_CLIENT_SECRET ?? "";
const tenantId = process.env.AZURE_AD_B2C_TENANT_ID ?? "";
const primaryUserFlow = process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW ?? "";
const customUrl = process.env.AZURE_AD_B2C_CUSTOM_URL ?? "";

type Profile = {
  extension_crmId: string;
} & AzureB2CProfile;

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADB2C<Profile>({
      clientId,
      clientSecret,
      authorization: {
        params: {
          scope: `${clientId} offline_access openid profile`,
        },
      },
      issuer: `https://${customUrl}/${tenantId}/${primaryUserFlow}/v2.0/`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.name,
          crm_id: profile.extension_crmId,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    jwt: jwtCallback,
  },
  pages: {
    signIn: "/signIn/",
  },
} satisfies AuthOptions;
