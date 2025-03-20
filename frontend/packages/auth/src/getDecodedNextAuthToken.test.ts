import { describe, expect, it } from "vitest";

import { getDecodedNextAuthToken } from "./getDecodedNextAuthToken";

describe("getDecodedNextAuthToken", () => {
  it("should decode a valid token", () => {
    const token =
      "header." +
      Buffer.from(JSON.stringify({ email: "test@example.com", extension_crmId: "12345", sub: "111-222-333" })).toString(
        "base64",
      ) +
      ".signature";
    const result = getDecodedNextAuthToken(token);

    expect(result).toEqual({ email: "test@example.com", extension_crmId: "12345", sub: "111-222-333" });
  });

  it("should throw an error for an invalid token format", () => {
    const token = "invalid.token";

    expect(() => getDecodedNextAuthToken(token)).toThrow(/Failed to decode token/);
  });

  it("should throw an error for a token with invalid base64 payload", () => {
    const token = "header.invalidbase64.signature";

    expect(() => getDecodedNextAuthToken(token)).toThrow(/Failed to decode token/);
  });

  it("should handle errors gracefully and throw an error", () => {
    const token = "header." + Buffer.from("invalid json").toString("base64") + ".signature";

    expect(() => getDecodedNextAuthToken(token)).toThrow(/Failed to decode token/);
  });
});
