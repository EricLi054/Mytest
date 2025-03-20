import { z } from "zod";

import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";

type Request = {
  client_id: string;
  client_secret: string;
  grant_type: "client_credentials";
  resource: string;
};

const responseSchema = z.object({
  access_token: z.string().min(1),
});

const message = (message: string) => `[getDynamicsAccessToken]: ${message}`;

export const getDynamicsAccessToken = async (): Promise<
  Result<{ value: { accessToken: string }; error: ReturnType<typeof message> }>
> => {
  const { DYNAMICS_URL, DYNAMICS_CLIENT_ID, DYNAMICS_OAUTH_CLIENT_SECRET } = automationEnv();

  try {
    const response = await fetch("https://login.microsoftonline.com/rac.com.au/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DYNAMICS_CLIENT_ID,
        client_secret: DYNAMICS_OAUTH_CLIENT_SECRET,
        grant_type: "client_credentials",
        resource: DYNAMICS_URL,
      } as const satisfies Request),
    });

    if (!response.ok) {
      return { success: false, error: message(`Request failed with status ${response.status}`) };
    }

    const { access_token } = responseSchema.parse(await response.json());

    return { success: true, accessToken: access_token };
  } catch (e) {
    return { success: false, error: message(`Failed to get token ${e?.toString()}`) };
  }
};
