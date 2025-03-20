import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GTM from ".";

vi.mock("#utils/analyticsTagging", () => ({
  logPageView: vi.fn(),
}));

vi.mock("@next/third-parties/google", () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) => {
    return <p>{gtmId}</p>;
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("GTM", () => {
  it("should render GTM Component", () => {
    render(<GTM gtmId={"123"} />);

    expect(screen.getByText("123")).toBeInTheDocument();
  });
});
