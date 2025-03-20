import { beforeEach, describe, expect, it, vi } from "vitest";

import setPCMCookie from "./setPCMCookie";

const mockedSet = vi.fn();
const mockedGet = vi.fn();
const mockedDelete = vi.fn();

vi.mock("server-only", () => ({}));

process.env = {
  NEXTAUTH_URL: "https://ractest.com.au",
  NODE_ENV: "test",
  PCM_AES_KEY: "test_aes_key",
  PCM_HASH_KEY: "test_hash_key",
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: mockedSet,
    get: mockedGet,
    delete: mockedDelete,
  })),
}));

vi.mock("../cryptography", () => ({
  getUUID: () => "mocked_uuid",
  createCookieString: (text: string) => text,
  createValidationString: (text: string) => text,
}));

describe("setPCMCookie", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set PCM cookies correctly", async () => {
    mockedGet.mockReturnValueOnce(undefined);
    mockedGet.mockReturnValueOnce(undefined);

    await setPCMCookie("mock_crm_id");

    expect(mockedSet).toHaveBeenCalledWith({
      name: "UUID",
      value: "mocked_uuid",
      httpOnly: true,
      path: "/",
      secure: true,
      domain: "ractest.com.au",
    });

    expect(mockedSet).toHaveBeenCalledWith({
      name: "Validation",
      value: "mocked_uuid",
      httpOnly: true,
      path: "/",
      secure: true,
      domain: "ractest.com.au",
    });
  });

  it("should not set PCM cookies if no crmId", async () => {
    mockedGet.mockReturnValueOnce(undefined);
    mockedGet.mockReturnValueOnce(undefined);

    await setPCMCookie("");

    expect(mockedSet).not.toHaveBeenCalledWith();
  });
});
