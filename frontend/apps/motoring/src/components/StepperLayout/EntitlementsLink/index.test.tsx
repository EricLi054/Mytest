import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import EntitlementsLink from ".";

const EMPTY_URL = "about:blank";

describe("RoadsideAssistanceEntitlementsLink", () => {
  it("should render correctly with default props", () => {
    render(<EntitlementsLink url="http://example.com" />);

    const link = screen.getByText("Roadside Assistance Entitlements");

    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute("href", "http://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("should render with EMPTY_URL when url is empty", () => {
    render(<EntitlementsLink url="" />);

    const link = screen.getByText("Roadside Assistance Entitlements");

    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute("href", EMPTY_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("should call the provided onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<EntitlementsLink url="http://example.com" onClick={handleClick} />);

    const link = screen.getByText("Roadside Assistance Entitlements");
    await user.click(link);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
