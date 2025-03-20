import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Qualtrics } from ".";

vi.mock("next/script", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-script">{children}</div>,
}));

describe("Qualtrics Component", () => {
  it("should render Qualtrics Script", () => {
    const { getByTestId } = render(<Qualtrics />);
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const mockScript = getByTestId("mock-script"); // Get the mocked script element

    expect(mockScript).toBeInTheDocument();
  });
});
