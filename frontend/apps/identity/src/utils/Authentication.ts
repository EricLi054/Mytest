"use server";

import { DefaultAzureCredential } from "@azure/identity";
import { serverEnv } from "#env/server";

import { annotatedLog } from "./logging";
import { getRegistrationSession } from "./session";

export async function getAccessToken(): Promise<string> {
  const { AZURE_MANAGEMENT_APPLICATION_ID, AZURE_APIM_CLIENT_ID } = serverEnv();
  const defaultCredentialOptions = { managedIdentityClientId: AZURE_APIM_CLIENT_ID };
  const tokenCredential = new DefaultAzureCredential(defaultCredentialOptions);

  let tokenResponse = "";
  const session = await getRegistrationSession({ currentPage: "/match" });
  const log = (message: string) => annotatedLog("getAccessToken", message, session.id, session.person?.personId ?? "");

  try {
    const azureManagementAppId = AZURE_MANAGEMENT_APPLICATION_ID;
    if (!azureManagementAppId) {
      throw new Error("AZURE_MANAGEMENT_APPLICATION_ID is not defined");
    }
    tokenResponse = (await tokenCredential.getToken(azureManagementAppId)).token;
  } catch (error: unknown) {
    log(`Error for ${AZURE_MANAGEMENT_APPLICATION_ID}: ${(error as Error).message}`);
  }
  return tokenResponse;
}
