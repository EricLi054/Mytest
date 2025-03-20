import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CloudinaryAsset from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getCloudinaryAsset: vi.fn(() => ({
    data: {
      horizons_cloudinaryAsset: {
        title: "A Cloudinary Image",
        image: [
          {
            secure_url: "https://domain.com/myimage.png",
            width: 100,
            height: 100,
          },
        ],
        image_data: [
          {
            context: {
              custom: {
                alt: "A Cloudinary Image alt",
                caption: "Image Caption",
              },
            },
          },
        ],
        showCaption: true,
        link: "https://domain.com/",
        openLinkInNewTab: true,
        fillContainerWidth: false,
      },
    },
  })),
}));

describe("CloudinaryAsset", () => {
  it("should fetch a Cloudinary Asset data and render", async () => {
    const cloudinaryAsset = await CloudinaryAsset({ data: { sys: { id: "1234" } } });
    render(cloudinaryAsset);

    expect(screen.getByAltText("A Cloudinary Image alt")).toBeInTheDocument();
  });
});
