import { z } from "zod";

import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";
import { msGraphUrl } from "./constants";

type Request = {
  client_id: string;
  client_secret: string;
  scope: `${typeof msGraphUrl}/.default`;
  grant_type: "client_credentials";
};

const responseSchema = z.object({
  access_token: z.string().min(1),
});

const message = (message: string) => `[getMsGraphAccessToken]: ${message}`;

export const getMsGraphAccessToken = async (): Promise<
  Result<{ value: { accessToken: string }; error: ReturnType<typeof message> }>
> => {
  const { MS_GRAPH_TENANT_ID, MS_GRAPH_CLIENT_ID, MS_GRAPH_OAUTH_CLIENT_SECRET } = automationEnv();

  try {
    const response = await fetch(`https://login.microsoftonline.com/${MS_GRAPH_TENANT_ID}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: MS_GRAPH_CLIENT_ID,
        client_secret: MS_GRAPH_OAUTH_CLIENT_SECRET,
        scope: `${msGraphUrl}/.default`,
        grant_type: "client_credentials",
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
