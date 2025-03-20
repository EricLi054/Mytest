import type { Result } from "@racwa/types";

import { automationEnv } from "../../env/automationEnv";
import { getAccount } from "./getAccount";

type Request = {
  crmid: "";
};

const message = (message: string) => `[unlinkPerson]: ${message}` as const;

export const unlinkPeson = async ({
  email,
}: {
  email: string;
}): Promise<Result<{ error: ReturnType<typeof message> }>> => {
  const accountResult = await getAccount({ email });

  if (!accountResult.success) {
    console.log(accountResult.error);
    return {
      success: false,
      error: message(`Failed to unlink account with email [${email}]`),
    };
  }

  const { APIM_URL, APIM_SUBSCRIPTION_KEY } = automationEnv();

  try {
    const response = await fetch(`${APIM_URL}/adb2cgraph/v1/users/${accountResult.id}`, {
      method: "PATCH",
      headers: {
        "Ocp-Apim-Subscription-Key": APIM_SUBSCRIPTION_KEY,
        SourceSystem: "rac-digital-test-automation",
      },
      body: JSON.stringify({ crmid: "" } as const satisfies Request),
    });

    if (!response.ok) {
      return {
        success: false,
        error: message(`Failed to unlink account with email [${email}], response status ${response.status}`),
      };
    }

    console.log(message(`Unlinked person from account with email [${email}]`));

    return { success: true };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
