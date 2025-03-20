import { z } from "zod";

import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";
import { ADB2CGraphUserSchema } from "./schemas";

type Request = {
  crmid: string;
};

const message = (message: string) => `[isPersonLinked: ${message}` as const;

export const isPersonLinked = async ({
  crmId,
}: {
  crmId: string;
}): Promise<Result<{ value: { isLinked: boolean }; error: ReturnType<typeof message> }>> => {
  const { APIM_URL, APIM_SUBSCRIPTION_KEY } = automationEnv();

  try {
    const response = await fetch(`${APIM_URL}/adb2cgraph/v1/user-by-crmid`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": APIM_SUBSCRIPTION_KEY,
        SourceSystem: "rac-digital-test-automation",
      },
      body: JSON.stringify({ crmid: crmId } as const satisfies Request),
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

    return { success: true, isLinked: parseResult.data.length > 0 };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
