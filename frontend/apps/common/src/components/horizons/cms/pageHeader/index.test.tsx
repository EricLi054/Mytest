import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PageHeader from ".";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getPageHeader: vi.fn(() => ({
    data: {
      horizons_pageHeader: {
        title: "Page Header Title",
        image: {
          title: "Page Header Image",
          image: [{ secure_url: "https://domain.com/myimage.png" }],
        },
        sectionColour: "White",
        parentBreadcrumb: "Drive",
      },
    },
  })),
}));

describe("PageHeader", () => {
  it("should fetch Page Header data and render", async () => {
    const pageHeader = await PageHeader({ data: { sys: { id: "1234" } } });
    render(pageHeader);

    expect(screen.getByText("Drive")).toBeInTheDocument();
  });
});
