import { z } from "zod";

import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";
import { ADB2CGraphUserSchema } from "./schemas";

type Request = {
  email: string;
};

const message = (message: string) => `[getAccount]: ${message}` as const;

export const getAccount = async ({
  email,
}: {
  email: string;
}): Promise<Result<{ value: z.infer<typeof ADB2CGraphUserSchema>; error: ReturnType<typeof message> }>> => {
  const { APIM_URL, APIM_SUBSCRIPTION_KEY } = automationEnv();

  try {
    const response = await fetch(`${APIM_URL}/adb2cgraph/v1/user-by-email`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": APIM_SUBSCRIPTION_KEY,
        SourceSystem: "rac-digital-test-automation",
      },
      body: JSON.stringify({ email } as const satisfies Request),
    });

    if (!response.ok) {
      return { success: false, error: message(`Request failed, status ${response.status}`) };
    }

    const parseResult = z.array(ADB2CGraphUserSchema).safeParse(await response.json());

    if (!parseResult.success) {
      return {
        success: false,
        error: message(`Failed to parse response body [${parseResult.error.message}]`),
      };
    }

    const account = parseResult.data[0];

    if (!account) {
      return {
        success: false,
        error: message(`Account not found for email [${email}]`),
      };
    }

    return { success: true, ...account };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
