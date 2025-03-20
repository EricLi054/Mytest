import { describe, expect, it, vi } from "vitest";

import { getDecodedNextAuthToken } from "@racwa/auth";

import { getAccessToken } from "./getAccessToken";
import { getCrmId } from "./getCrmId";

vi.mock("server-only", () => ({}));
vi.mock("@racwa/auth");

vi.mock("./getAccessToken");

describe("getCrmId", () => {
  it("should return the CRM ID when access token is valid", async () => {
    const mockAccessToken = "validAccessToken";
    const mockDecodedToken = { extension_crmId: "12345" };

    vi.mocked(getAccessToken).mockResolvedValue(mockAccessToken);
    vi.mocked(getDecodedNextAuthToken).mockReturnValue(mockDecodedToken);

    const crmId = await getCrmId();

    expect(crmId).toBe("12345");
  });

  it("should return undefined when getAccessToken throws an error", async () => {
    vi.mocked(getAccessToken).mockRejectedValue(new Error("Failed to get access token"));

    const crmId = await getCrmId();

    expect(crmId).toBeUndefined();
  });

  it("should return undefined when getDecodedToken returns an invalid token", async () => {
    const mockAccessToken = "invalidAccessToken";
    const mockDecodedToken = {};

    vi.mocked(getAccessToken).mockResolvedValue(mockAccessToken);
    vi.mocked(getDecodedNextAuthToken).mockReturnValue(mockDecodedToken);

    const crmId = await getCrmId();

    expect(crmId).toBeUndefined();
  });
});
