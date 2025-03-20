import type { Result } from "@racwa/types";

import type { MyRacAccount } from "../../utils";
import { automationEnv } from "../../env/automationEnv";
import { msGraphUrl } from "./constants";
import { getMsGraphAccessToken } from "./getMsGraphAccessToken";

type Request = {
  accountEnabled: true;
  displayName: string;
  passwordProfile: {
    password: string;
    forceChangePasswordNextSignIn: false;
  };
  identities: [
    {
      issuer: string;
      issuerAssignedId: string;
      signInType: "emailAddress";
    },
  ];
};

const message = (message: string) => `[createAccount]: ${message}` as const;

export const createAccount = async ({
  email,
  password,
}: MyRacAccount): Promise<Result<{ error: ReturnType<typeof message> }>> => {
  const { MS_GRAPH_TENANT_ID } = automationEnv();

  const accessTokenResult = await getMsGraphAccessToken();

  if (!accessTokenResult.success) {
    console.log(accessTokenResult.error);
    return { success: false, error: message("Failed to get access token") };
  }

  try {
    const response = await fetch(`${msGraphUrl}/v1.0/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessTokenResult.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountEnabled: true,
        displayName: email.split("@")[0] ?? "Missing display name",
        passwordProfile: {
          password,
          forceChangePasswordNextSignIn: false,
        },
        identities: [
          {
            issuer: MS_GRAPH_TENANT_ID,
            issuerAssignedId: email,
            signInType: "emailAddress",
          },
        ],
      } as const satisfies Request),
    });

    if (!response.ok) {
      return { success: false, error: message(`Request failed, status ${response.status}`) };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
