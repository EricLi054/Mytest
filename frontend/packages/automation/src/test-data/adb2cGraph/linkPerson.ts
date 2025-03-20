import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";
import { getAccount } from "./getAccount";

type Request = {
  crmid: string;
};

const message = (message: string) => `[linkPerson]: ${message}` as const;

export const linkPerson = async ({
  crmId,
  email,
}: {
  crmId: string;
  email: string;
}): Promise<Result<{ error: ReturnType<typeof message> }>> => {
  const accountResult = await getAccount({ email });

  if (!accountResult.success) {
    console.log(accountResult.error);
    return {
      success: false,
      error: message(`Failed to link person [${crmId}] to account with email [${email}]`),
    };
  }

  if (accountResult.crmid) {
    return { success: false, error: message(`Failed, person [${crmId}] is already linked to an account`) };
  }

  const { APIM_URL, APIM_SUBSCRIPTION_KEY } = automationEnv();

  try {
    const response = await fetch(`${APIM_URL}/adb2cgraph/v1/users/${accountResult.id}`, {
      method: "PATCH",
      headers: {
        "Ocp-Apim-Subscription-Key": APIM_SUBSCRIPTION_KEY,
        SourceSystem: "rac-digital-test-automation",
      },
      body: JSON.stringify({ crmid: crmId } as const satisfies Request),
    });

    if (!response.ok) {
      return {
        success: false,
        error: message(
          `Failed to link account with email [${email}] to person with CRM ID ${crmId}, response status ${response.status}`,
        ),
      };
    }

    console.log(message(`Linked person [${crmId}] to account with email [${email}]`));

    return { success: true };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
