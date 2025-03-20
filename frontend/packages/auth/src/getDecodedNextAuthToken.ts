export type DecodedToken = {
  email?: string;
  extension_crmId?: string;
  sub?: string;
};

export function getDecodedNextAuthToken(token: string): DecodedToken {
  try {
    // Split the token and decode the payload
    const payload = token.split(".")[1];
    if (!payload) {
      throw new Error("Invalid token format");
    }

    // Decode the payload from base64
    const decoded: DecodedToken = JSON.parse(Buffer.from(payload, "base64").toString()) as DecodedToken;

    // Return the decoded email and CRM ID
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode token: ${error.message}`);
    } else {
      throw new Error("Failed to decode token: Unknown error");
    }
  }
}
