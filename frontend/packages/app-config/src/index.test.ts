/* eslint-disable turbo/no-undeclared-env-vars */
import { beforeEach, describe, expect, it, vi } from "vitest";

import initApplicationConfiguration from ".";

const KEY_VAULT_URL = "example-key-vault-url";
const ENVIRONMENT = "my-environment";

let mockGetSecret = vi.fn();

vi.mock("dotenv");
vi.mock("@azure/identity");
vi.mock("@azure/keyvault-secrets", () => {
  return {
    SecretClient: vi.fn().mockImplementation(() => ({
      getSecret: mockGetSecret,
    })),
  };
});

describe("initApplicationConfiguration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {};
  });

  it("should load environment variables", async () => {
    process.env = {
      EXAMPLE: "example-value-1",
      EXAMPLE_2: "example-value-2",
      EXAMPLE_WITH_INNER: "$EXAMPLE-with-inner",
      EXAMPLE_WITH_INNER_2: "$EXAMPLE_2-with-inner",
      EXAMPLE_WITH_INNER_3: "$EXAMPLE-with-multiple-inner-$EXAMPLE-$EXAMPLE_2",
      EXAMPLE_WITH_INNER_4: "$EXAMPLE$EXAMPLE_2$EXAMPLE",
      EXAMPLE_WITH_INNER_5: "$EXAMPLE_2$EXAMPLE",
      EXAMPLE_WITH_INNER_6: "$EXAMPLE_2_$EXAMPLE_WITH_INNER_2_double-wh$ammy",
      EXAMPLE_WITH_INNER_PARTIAL: "example-val",
      EXAMPLE_WITH_INNER_PARTIAL_2: "example",
      EXAMPLE_DOLLAR_SYMBOL_1: "ex$ample",
      EXAMPLE_DOLLAR_SYMBOL_2: "$EXAMPL_E",
      KEY_VAULT_URL: KEY_VAULT_URL,
    };

    await initApplicationConfiguration(ENVIRONMENT);

    expect(process.env.EXAMPLE).toBe("example-value-1");
    expect(process.env.EXAMPLE_WITH_INNER).toBe("example-value-1-with-inner");
    expect(process.env.EXAMPLE_WITH_INNER_2).toBe("example-value-2-with-inner");
    expect(process.env.EXAMPLE_WITH_INNER_3).toBe(
      "example-value-1-with-multiple-inner-example-value-1-example-value-2",
    );
    expect(process.env.EXAMPLE_WITH_INNER_4).toBe("example-value-1example-value-2example-value-1");
    expect(process.env.EXAMPLE_WITH_INNER_5).toBe("example-value-2example-value-1");
    expect(process.env.EXAMPLE_WITH_INNER_6).toBe("example-value-2_example-value-2-with-inner_double-wh$ammy");
    expect(process.env.EXAMPLE_WITH_INNER_PARTIAL).toBe("example-val");
    expect(process.env.EXAMPLE_WITH_INNER_PARTIAL_2).toBe("example");
    expect(process.env.EXAMPLE_DOLLAR_SYMBOL_1).toBe("ex$ample");
    expect(process.env.EXAMPLE_DOLLAR_SYMBOL_2).toBe("$EXAMPL_E");
  });

  it("should throw an error if KEY_VAULT_URL is not defined", async () => {
    await expect(initApplicationConfiguration(ENVIRONMENT)).rejects.toThrow(
      "Unable to load Application Configuration as KEY_VAULT_URL does not exist",
    );
  });

  it("should load secrets from Key Vault", async () => {
    process.env = {
      KEY_VAULT_URL: KEY_VAULT_URL,
      KEY_VAULT_SECRET: "RETRIEVED_FROM_KEY_VAULT",
    };

    mockGetSecret = vi.fn().mockResolvedValue({ value: "the-secret" });

    await initApplicationConfiguration(ENVIRONMENT);

    expect(mockGetSecret).toHaveBeenCalledWith("KEY-VAULT-SECRET");
    expect(process.env.KEY_VAULT_SECRET).toBe("the-secret");
  });

  it("should log error message when there is an issue fetching a secret from Key Vault", async () => {
    process.env = {
      KEY_VAULT_URL: KEY_VAULT_URL,
      KEY_VAULT_SECRET: "RETRIEVED_FROM_KEY_VAULT",
    };

    mockGetSecret = vi.fn().mockRejectedValue(new Error("Error"));

    const consoleLogSpy = vi.spyOn(console, "log");

    await initApplicationConfiguration(ENVIRONMENT);

    expect(mockGetSecret).toHaveBeenCalledWith("KEY-VAULT-SECRET");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "@racwa/app-config: Error fetching Key Vault secret for KEY_VAULT_SECRET",
    );
    expect(process.env.KEY_VAULT_SECRET).toBe("RETRIEVED_FROM_KEY_VAULT");

    consoleLogSpy.mockRestore();
  });
});
