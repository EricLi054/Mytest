import { z } from "zod";

import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";
import { FinOpsProductHoldingHeaderSchema } from "./schemas";

const message = (message: string) => `[getProductHoldingHeader]: ${message}` as const;

export const getProductHoldingHeader = async ({
  id,
}: {
  id: string;
}): Promise<
  Result<{
    value: z.infer<typeof FinOpsProductHoldingHeaderSchema>;
    error: ReturnType<typeof message>;
  }>
> => {
  const { APIM_URL, APIM_SUBSCRIPTION_KEY } = automationEnv();

  try {
    const response = await fetch(`${APIM_URL}/productholding/v2/productholding/${id}`, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": APIM_SUBSCRIPTION_KEY,
        SourceSystem: "rac-digital-test-automation",
      },
    });

    if (!response.ok) {
      return { success: false, error: message(`Request failed, status ${response.status}`) };
    }

    const parseResult = z
      .object({
        IsSuccess: z.boolean(),
        Value: FinOpsProductHoldingHeaderSchema,
      })
      .safeParse(await response.json());

    if (!parseResult.success) {
      return { success: false, error: message(`Failed to parse response body [${parseResult.error.message}]`) };
    }

    if (!parseResult.data.IsSuccess) {
      return { success: false, error: message(`Request failed: ${JSON.stringify(parseResult.data)}`) };
    }

    return { success: true, ...parseResult.data.Value };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
