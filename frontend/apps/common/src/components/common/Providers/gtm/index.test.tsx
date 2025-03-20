import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { logPageView } from "#utils/common/analyticsTagging";
import { describe, expect, it, vi } from "vitest";

import GTM from ".";

vi.mock("#utils/common/analyticsTagging", () => ({
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
  it("should render initially and not fire a virtual page view", () => {
    vi.mocked(usePathname).mockReturnValue("Initial Path");

    render(<GTM gtmId={"123"} />);

    expect(screen.getByText("123")).toBeInTheDocument();
    expect(logPageView).toHaveBeenCalledTimes(0);
  });

  it("should fire virtual page view on pathname change when already initialised", () => {
    vi.mocked(usePathname).mockReturnValue("Initial Path");
    const { rerender } = render(<GTM gtmId={"123"} />);

    vi.mocked(usePathname).mockReturnValue("Changed Path");
    rerender(<GTM gtmId={"123"} />);

    expect(logPageView).toHaveBeenCalledTimes(1);
  });
});
