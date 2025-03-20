import { describe, expect, it } from "vitest";

import { getADB2CLogoutUrl, getADB2CTokenEndpoint, getADB2CUpdateEmailUrl, getADB2CUpdatePasswordUrl } from "./adb2c";

process.env = {
  NODE_ENV: "test",
  AZURE_AD_B2C_CUSTOM_URL: "testCustomUrl",
  AZURE_AD_B2C_TENANT_ID: "testTenantID",
  AZURE_AD_B2C_CLIENT_ID: "testClientId",
  AZURE_AD_B2C_CLIENT_SECRET: "testClientSecret",
  AZURE_AD_B2C_PRIMARY_USER_FLOW: "testPrimaryUserFlow",
  AZURE_AD_B2C_PASSWORD_UPDATE_FLOW: "testPasswordUpdateFlow",
  AZURE_AD_B2C_EMAIL_UPDATE_FLOW: "testEmailUpdateFlow",
};

describe("getADB2CLogoutUrl", () => {
  it("should get logout url", async () => {
    const url = await getADB2CLogoutUrl("testUrl");

    expect(url).toEqual(
      "https://testCustomUrl/testTenantID/testPrimaryUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=testUrl",
    );
  });
});

describe("getADB2CTokenEndpoint", () => {
  it("should get token endpoint when refresh is true", async () => {
    const url = await getADB2CTokenEndpoint(true);

    expect(url).toEqual("https://testCustomUrl/testTenantID/testPrimaryUserFlow/oauth2/v2.0/token");
  });

  it("should get token endpoint when refresh is false", async () => {
    const url = await getADB2CTokenEndpoint(false);

    expect(url).toEqual("https://testCustomUrl/testTenantID/testEmailUpdateFlow/oauth2/v2.0/token");
  });
});

describe("getADB2CUpdatePasswordUrl", () => {
  it("should get update password url", async () => {
    const url = await getADB2CUpdatePasswordUrl("testRedirectUrl", "testCurrentUrl");

    expect(url).toEqual(
      "https://testCustomUrl/testTenantID/testPasswordUpdateFlow/oauth2/v2.0/authorize?client_id=testClientId&redirect_uri=testCurrentUrl&response_type=code&scope=testClientId offline_access openid profile&state=testRedirectUrl",
    );
  });
});

describe("getADB2CUpdateEmailUrl", () => {
  it("should get update email url", async () => {
    const url = await getADB2CUpdateEmailUrl("testRedirectUrl", "testCurrentUrl");

    expect(url).toEqual(
      "https://testCustomUrl/testTenantID/testEmailUpdateFlow/oauth2/v2.0/authorize?client_id=testClientId&redirect_uri=testCurrentUrl&response_type=code&scope=testClientId offline_access openid profile&state=testRedirectUrl",
    );
  });
});
