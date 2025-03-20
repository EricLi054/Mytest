import { render, screen } from "@testing-library/react";
import { TestCategory, TestYouTubeVideo } from "#testing/data/testData";
import { beforeEach, describe, expect, it, vi } from "vitest";

import VideoCarousel from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getVideoCarousel: vi.fn(() => ({
    data: {
      horizons_videoCarousel: {
        title: "Featured Content Title",
        slug: "featured-content-item",
        sectionColour: "White",
        category: TestCategory,
        heading: "Recommended",
        videosCollection: {
          items: [{ ...TestYouTubeVideo }],
        },
      },
    },
  })),
}));

describe("VideoCarousel", () => {
  beforeEach(() => {
    global.window.matchMedia = vi.fn(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("should fetch Video Carousel Content data and render", async () => {
    const props = { data: { sys: { id: "1234" } } };

    render(await VideoCarousel(props));

    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });
});
