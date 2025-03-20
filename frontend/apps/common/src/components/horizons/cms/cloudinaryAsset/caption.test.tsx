import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { describe, expect, it } from "vitest";

import ImageCaption from "./caption";

describe("ImageCaption component", () => {
  it("should render the caption", () => {
    render(<ImageCaption captionText="Test caption" />);

    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });
});
