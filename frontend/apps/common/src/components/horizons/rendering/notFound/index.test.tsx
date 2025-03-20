import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from ".";

describe("NotFound Component", () => {
  it("should render the component correctly", () => {
    render(<NotFound />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveTextContent("You've ventured beyond the horizon");

    const bodyText = screen.getByText("Either you've gone too far or we moved the page.");

    expect(bodyText).toBeInTheDocument();

    const button = screen.getByRole("link", { name: /home/i });

    expect(button).toBeInTheDocument();
  });
});
