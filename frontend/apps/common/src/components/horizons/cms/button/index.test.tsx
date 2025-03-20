import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getButton: vi.fn(() => ({
    data: {
      horizons_button: {
        title: "Test Button",
        variant: "contained",
        colour: "primary",
        text: "A Test Button",
        link: "https://rac.com.au",
      },
    },
  })),
}));

describe("Button", () => {
  it("should fetch Button data and render", async () => {
    const page = await Button({ data: { sys: { id: "1234" } } });
    render(page);

    expect(screen.getByText("A Test Button")).toBeInTheDocument();
  });
});
