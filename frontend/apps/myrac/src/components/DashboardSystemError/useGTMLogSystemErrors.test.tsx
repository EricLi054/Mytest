import { render } from "@testing-library/react";
import { logEvent } from "#utils/analyticsTagging";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ProductSystemKey } from "./types";
import useGTMLogSystemErrors from "./useGTMLogSystemErrors";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

const TestComponent = (props: { errors: ProductSystemKey[] }) => {
  useGTMLogSystemErrors(props.errors);
  return <>Test</>;
};

describe("useGTMLogSystemErrors", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not log event if systemsWithErrors is empty", () => {
    render(<TestComponent errors={[]} />);

    expect(logEvent).not.toHaveBeenCalled();
  });

  it("should log event with correct message for single system error", () => {
    render(<TestComponent errors={["Finance"]} />);

    expect(logEvent).toHaveBeenCalledWith("System unavailable message - Fin");
  });

  it("should log event with correct message for multiple system errors", () => {
    render(<TestComponent errors={["Finance", "Shield", "FinOps"]} />);

    expect(logEvent).toHaveBeenCalledWith("System unavailable message - Fin, FinOps, Ins");
  });

  it('should log event with "unknown" for unrecognized system keys', () => {
    render(<TestComponent errors={["UnknownSystem" as unknown as ProductSystemKey]} />);

    expect(logEvent).toHaveBeenCalledWith("System unavailable message - unknown");
  });
});
