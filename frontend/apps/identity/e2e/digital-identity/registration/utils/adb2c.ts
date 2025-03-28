/**
 * Obtain an access token for the Graph API from the Microsoft auth endpoint
 * @returns the access token
 */
export async function getAdb2cAccessToken(): Promise<string> {
  const tenantId = process.env.MS_GRAPH_TENANT ?? "";
  const clientId = process.env.MS_GRAPH_CLIENT_ID ?? "";
  const clientSecret = process.env.MS_GRAPH_SECRET ?? "";

  if (!tenantId || tenantId === "RETRIEVED_FROM_KEY_VAULT") {
    throw new Error("Failed to retrieve valid tenantId from environment variable MS_GRAPH_TENANT");
  }
  if (!clientId || clientId === "RETRIEVED_FROM_KEY_VAULT") {
    throw new Error("Failed to retrieve valid clientId from environment variable MS_GRAPH_CLIENT_ID");
  }
  if (!clientSecret || clientSecret === "RETRIEVED_FROM_KEY_VAULT") {
    throw new Error("Failed to retrieve valid clientSecret from environment variable MS_GRAPH_SECRET");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("scope", "https://graph.microsoft.com/.default");
  params.append("grant_type", "client_credentials");

  try {
    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch access token. Status: ${response.status}`);
    }

    const data = (await response.json()) as { access_token: string };
    const accessToken = data.access_token;

    if (!accessToken) {
      throw new Error("No access token found in the response");
    }

    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}
/**
 * Retrieve the ID of the ADB2C record with the specified email
 * @param accessToken the access token for the Graph API
 * @param email the user's email
 * @returns the ID for the record
 */
export async function getAdb2cUserByEmail(accessToken: string, email: string): Promise<string> {
  try {
    const graphApiUrl = `https://graph.microsoft.com/v1.0/users?$filter=displayName eq '${email}'`;

    const response = await fetch(graphApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user. Status: ${response.status}`);
    }

    const data = (await response.json()) as { value?: { id: string }[] };

    if (!data.value || data.value.length === 0) {
      return "";
    } else if (data.value.length === 1) {
      return data.value[0]?.id ?? "";
    } else {
      throw new Error("Multiple users found with the provided email.");
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}
/**
 * Delete an ADB2C user
 * @param accessToken the access token for the Graph API
 * @param objectId the Object ID of the record to delete
 */
export async function deleteAdb2cUser(accessToken: string, objectId: string): Promise<void> {
  try {
    const graphApiUrl = `https://graph.microsoft.com/v1.0/users/${objectId}`;

    const response = await fetch(graphApiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
