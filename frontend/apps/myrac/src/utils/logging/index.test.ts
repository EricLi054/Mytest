import type { Mock, MockInstance } from "vitest";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { log, logError } from ".";

describe("log", () => {
  let consoleLogSpy: MockInstance;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => vi.fn());
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should log a message with all provided values", () => {
    log("AuthComponent", "Authentication successful", "abc-123", "CRM456");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[AuthComponent]: Authentication successful | CorrelationID: abc-123 | CRM: CRM456",
    );
  });

  it("should log a message with a default CRM value if crmId is undefined", () => {
    log("AuthComponent", "Authentication successful", "abc-123");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[AuthComponent]: Authentication successful | CorrelationID: abc-123 | CRM: unknown",
    );
  });

  it("should log a message with an empty string crmId if explicitly passed as an empty string", () => {
    log("AuthComponent", "Authentication successful", "abc-123", "");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[AuthComponent]: Authentication successful | CorrelationID: abc-123 | CRM: ",
    );
  });
});

describe("logError", () => {
  let consoleErrorSpy: MockInstance;
  vi.mock("next/dist/client/components/redirect-error", () => ({
    isRedirectError: vi.fn(() => false),
  }));

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => vi.fn());
    vi.resetAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("should log an error with all provided values", () => {
    const errorInstance = new Error("Something went wrong");

    logError(errorInstance, "AuthComponent", "Authentication failed", "abc-123", "CRM456");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[AuthComponent]: Authentication failed | CorrelationID: abc-123 | CRM: CRM456",
      "Something went wrong",
    );
  });

  it("should log an error with 'unknown' CRM when crmId is undefined", () => {
    const errorInstance = new Error("Something went wrong");

    logError(errorInstance, "AuthComponent", "Authentication failed", "abc-123");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[AuthComponent]: Authentication failed | CorrelationID: abc-123 | CRM: unknown",
      "Something went wrong",
    );
  });

  it("should log an error with an empty CRM when crmId is explicitly passed as an empty string", () => {
    const errorInstance = new Error("Something went wrong");

    logError(errorInstance, "AuthComponent", "Authentication failed", "abc-123", "");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[AuthComponent]: Authentication failed | CorrelationID: abc-123 | CRM: ",
      "Something went wrong",
    );
  });

  it("should log an full error instance when not a plain error", () => {
    const errorInstance = new ZodError([
      { code: "invalid_literal", message: "Invalid value", expected: "Test", received: "Test2", path: ["name"] },
    ]);

    logError(errorInstance, "Validation", "Validation failed", "abc-123", "");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[Validation]: Validation failed | CorrelationID: abc-123 | CRM: ",
      errorInstance.message,
    );
  });

  it("should not log if it is a redirect error", () => {
    const redirectError = new Error("Redirecting...");
    (isRedirectError as unknown as Mock).mockReturnValue(true);

    logError(redirectError, "AuthComponent", "Redirect occurred", "xyz-789", "CRM789");

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
