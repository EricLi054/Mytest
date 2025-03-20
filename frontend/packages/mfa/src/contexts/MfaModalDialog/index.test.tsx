import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useMfaModalDialog } from ".";

describe("useMfaModalDialog", () => {
  it("should throw when not used within a MfaModalDialogContext Provider", () => {
    expect(() => renderHook(() => useMfaModalDialog())).toThrow(
      "useMfaModalDialog must be used within a MfaModalDialogContext Provider.",
    );
  });
});
