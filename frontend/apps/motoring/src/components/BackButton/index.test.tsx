import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BackButton from ".";

describe("Back", () => {
  it("should be able to render", () => {
    render(<BackButton />);

    expect(screen.getByRole("link", { name: "Back" })).toBeVisible();
  });

  it("should render with correct styling", () => {
    render(<BackButton />);

    const backText = screen.getByText("Back");

    expect(backText).toBeInTheDocument();
    expect(backText).toHaveStyle({ textDecoration: "underline", fontSize: "18px" });
  });
});
