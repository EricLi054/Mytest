import { describe, expect, it, vi } from "vitest";

import { aesDecrypt, aesEncrypt, createCookieString, createValidationString, getUUID } from ".";

vi.mock("server-only", () => ({}));

describe("cryptography", () => {
  it("should generate UUID correctly", () => {
    const crmId = "mock_crm_id";

    const uuid = getUUID(crmId);
    const splitUuid = uuid.split(" ");

    expect(splitUuid[0]).toEqual(crmId);
    expect(Number(splitUuid[1])).toBeGreaterThan(0);
  });

  it("should encrypt and decrypt text correctly", () => {
    const plainText = "Hello, World!";
    const encryptedText = aesEncrypt(plainText);
    const decryptedText = aesDecrypt(encryptedText);

    expect(decryptedText).toBe(plainText);
  });

  it("should create cookie string correctly", () => {
    const plainTextCookieContents = "cookie contents";
    const encryptedCookie = createCookieString(plainTextCookieContents);
    const decryptedCookie = aesDecrypt(encryptedCookie);

    expect(decryptedCookie).toBe(plainTextCookieContents);
  });

  it("should create validation string correctly", () => {
    const plainTextCookieContents = "cookie contents";
    const validationString = createValidationString(plainTextCookieContents);

    expect(validationString).toBeTruthy();
  });
});
