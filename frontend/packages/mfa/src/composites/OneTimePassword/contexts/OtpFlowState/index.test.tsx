import { renderHook } from "@testing-library/react";
import { getMockDefaultFlowState } from "#composites/OneTimePassword/testing/mocks";
import { describe, expect, it } from "vitest";

import { OtpFlowStateProvider, useOtpFlowState } from ".";

describe("useOtpFlowState", () => {
  it("should throw when not used within a OtpFlowStateProvider", () => {
    expect(() => renderHook(() => useOtpFlowState())).toThrow(
      "useOtpFlowState must be used within a OtpFlowStateProvider.",
    );
  });

  it("should return flowState context with default values when used within a OtpFlowStateProvider", () => {
    const { result } = renderHook(() => useOtpFlowState(), {
      wrapper: ({ children }) => <OtpFlowStateProvider>{children}</OtpFlowStateProvider>,
    });
    const { flowState } = result.current;

    expect(flowState).toMatchObject(getMockDefaultFlowState());
  });
});
