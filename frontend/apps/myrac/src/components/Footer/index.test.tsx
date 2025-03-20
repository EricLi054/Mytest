import { render, screen } from "@testing-library/react";
import { MyRACThemeProvider } from "#theme";
import { describe, expect, it, vi } from "vitest";

import Footer from ".";
import { getFooterData } from "./data";
import { footerContentfulData } from "./testData";

vi.mock("server-only", () => ({}));
vi.mock("./data", () => ({
  getFooterData: vi.fn(),
}));
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));

describe("Footer", () => {
  it("should render data", async () => {
    vi.mocked(getFooterData).mockReturnValueOnce(Promise.resolve(footerContentfulData));
    render(<MyRACThemeProvider>{await Footer({ id: "1" })}</MyRACThemeProvider>);

    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Information & advice")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RAC on Facebook" })).toBeInTheDocument();
    expect(screen.getByText("Footer text")).toBeInTheDocument();
  });
});
