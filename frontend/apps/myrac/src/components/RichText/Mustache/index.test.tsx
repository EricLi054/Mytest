import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Mustache from ".";
import { getMustacheData } from "./data";

vi.mock("server-only", () => ({}));
vi.mock("./data", () => ({
  getMustacheData: vi.fn(),
}));

vi.mock("#graphql/person/queries", () => ({
  getPerson: vi.fn(() => {
    return {
      title: "Mr",
      firstName: "John",
      surname: "Doe",
      cardColour: "Gold",
      racId: "123456",
      membershipCardNumber: "1231231231231231",
      membershipType: "Gold",
      tier: "Gold",
    };
  }),
}));

const noColourMustache = {
  template: "No colour",
  textColour: null,
};

const colourMustache = {
  template: "Colour",
  textColour: { hex: "#FFD100" },
};

const textReplace = {
  template: "{{person.FirstName}} test",
  textColour: null,
};

describe("Mustache", () => {
  it("should render element as it comes", async () => {
    vi.mocked(getMustacheData).mockReturnValueOnce(Promise.resolve(noColourMustache));
    render(<>{await Mustache({ id: "1234" })}</>);

    const element = screen.getByText("No colour");

    expect(element).toBeVisible();
    expect(element).not.toHaveAttribute("style");
  });

  it("should render element with colour", async () => {
    vi.mocked(getMustacheData).mockReturnValueOnce(Promise.resolve(colourMustache));
    render(<>{await Mustache({ id: "1234" })}</>);

    const element = screen.getByText("Colour");

    expect(element).toBeVisible();
    expect(element).toHaveAttribute("style");
  });

  it("should render element with replace text", async () => {
    vi.mocked(getMustacheData).mockReturnValueOnce(Promise.resolve(textReplace));
    render(<>{await Mustache({ id: "1234" })}</>);

    const element = screen.getByText("John test");

    expect(element).toBeVisible();
    expect(element).not.toHaveAttribute("style");
  });
});
