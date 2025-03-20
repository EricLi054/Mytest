import type { z } from "zod";

import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";
import { PersonSchema } from "./schemas";

const message = (message: string) => `[getPerson]: ${message}` as const;

export const getPerson = async ({
  crmId,
}: {
  crmId: string;
}): Promise<Result<{ value: z.infer<typeof PersonSchema>; error: ReturnType<typeof message> }>> => {
  const { APIM_URL, APIM_SUBSCRIPTION_KEY } = automationEnv();

  try {
    const response = await fetch(`${APIM_URL}/person/v2/person/${crmId}`, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": APIM_SUBSCRIPTION_KEY,
        SourceSystem: "rac-digital-test-automation",
      },
    });

    if (!response.ok) {
      return { success: false, error: message(`Request failed, status ${response.status}`) };
    }

    const parseResult = PersonSchema.safeParse(await response.json());

    if (!parseResult.success) {
      return { success: false, error: message(`Failed to parse response body [${parseResult.error.message}]`) };
    }

    return { success: true, ...parseResult.data };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
