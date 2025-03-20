import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import YoutubeEmbed from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getYoutubeEmbed: vi.fn(() => ({
    data: {
      horizons_youtubeEmbed: {
        title: "YouTube Video Title",
        url: "https://youtube.com/v1234",
      },
    },
  })),
}));

describe("YoutubeEmbed", () => {
  it("should fetch YouTube embed data and render", async () => {
    const page = await YoutubeEmbed({ data: { sys: { id: "1234" } } });

    const view = renderToString(page);

    expect(view).toContain("https://youtube.com/v1234");
  });
});
