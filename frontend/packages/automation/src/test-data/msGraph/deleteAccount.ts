import type { Result } from "@racwa/types";

import { getAccount } from "../adb2cGraph";
import { msGraphUrl } from "./constants";
import { getMsGraphAccessToken } from "./getMsGraphAccessToken";

const message = (message: string) => `[deleteAccount]: ${message}` as const;

export const deleteAccount = async ({
  email,
}: {
  email: string;
}): Promise<Result<{ error: ReturnType<typeof message> }>> => {
  const getAccountResult = await getAccount({ email });

  if (!getAccountResult.success) {
    console.log(getAccountResult.error);
    return { success: false, error: message(`Failed to get account with email ${email}`) };
  }

  const accessTokenResult = await getMsGraphAccessToken();

  if (!accessTokenResult.success) {
    console.log(accessTokenResult.error);
    return { success: false, error: message("Failed to get access token") };
  }

  const { accessToken } = accessTokenResult;

  try {
    const response = await fetch(`${msGraphUrl}/v1.0/users/${getAccountResult.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { success: false, error: message(`Request failed, status ${response.status}`) };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
