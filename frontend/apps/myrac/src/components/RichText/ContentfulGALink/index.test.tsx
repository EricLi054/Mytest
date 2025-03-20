import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ContentfulGALink from ".";
import { getContentfulGALinkData } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getContentfulGALinkData: vi.fn(),
}));

const regularLink = {
  longLinkText: "Return to myRAC",
  linkUrl: "/myRAC",
  googleAnalyticsDescription: "Return to myRAC",
};

describe("Contentful GA Link", () => {
  it("should render a link", async () => {
    (getContentfulGALinkData as Mock).mockReturnValueOnce(Promise.resolve(regularLink));
    render(await ContentfulGALink({ id: "1234" }));

    expect(screen.getByText("Return to myRAC")).toBeInTheDocument();
  });
});
