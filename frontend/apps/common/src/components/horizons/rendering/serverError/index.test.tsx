import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ServerError from ".";

describe("ServerError Component", () => {
  it("should render the component correctly", () => {
    render(<ServerError />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveTextContent("500 miles from anywhere");

    const bodyText = screen.getByText("But we'll get you back home.");

    expect(bodyText).toBeInTheDocument();

    const button = screen.getByRole("link", { name: /home/i });

    expect(button).toBeInTheDocument();
  });
});
