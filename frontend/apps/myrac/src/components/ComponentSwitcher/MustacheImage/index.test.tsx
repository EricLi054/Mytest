import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { geMustacheImageData } from "./data";
import MustacheImage from "./index";

vi.mock("./data", () => ({
  geMustacheImageData: vi.fn(),
}));

describe("MustacheImage", () => {
  it("should render the image when data is returned", async () => {
    const mockData = {
      __typename: "MustacheImage",
      imageIdTemplate: "test-image.svg",
      altTemplate: "Test Image",
      borderRadius: 5,
    };
    vi.mocked(geMustacheImageData).mockResolvedValue(mockData);
    render(<>{await MustacheImage({ id: "1" })}</>);

    const image = await screen.findByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
    expect(image).toHaveAttribute("alt", mockData.altTemplate);
    expect(image).toHaveStyle({ borderRadius: `${mockData.borderRadius}px` });
  });

  it("should render null when no data is returned", async () => {
    vi.mocked(geMustacheImageData).mockResolvedValue(null);
    const result = await MustacheImage({ id: "1" });

    expect(result).toBeNull();
  });
});
