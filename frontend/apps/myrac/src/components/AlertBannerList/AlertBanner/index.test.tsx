import type { z } from "zod";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import type { BannerAlertSchema } from "../schema";
import AlertBanner from ".";

vi.mock("@racwa/react-components", () => ({
  RacwaOverhangNotification: ({
    in: isVisible,
    onClose,
    icon,
    title,
    children,
  }: {
    in: boolean;
    onClose: () => void;
    icon: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      {isVisible && (
        <div>
          <div>{icon}</div>
          <h2>{title}</h2>
          <div>{children}</div>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  ),
}));

describe("AlertBanner", () => {
  const bannerAlert: z.infer<typeof BannerAlertSchema> = {
    icon: "info-circle",
    title: "Test Alert",
    bodyText: {
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: "text",
                value: "This is an alert banner",
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
  };

  it("should render correctly when visible", () => {
    render(<AlertBanner bannerAlert={bannerAlert} />);

    expect(screen.getByText("Test Alert")).toBeInTheDocument();
    expect(screen.getByText("This is an alert banner")).toBeInTheDocument();

    const icon = screen.getByRole("img", { hidden: true });

    expect(icon).toHaveClass("fa-circle-info");
  });

  it("should close the notification when the close button is clicked", async () => {
    render(<AlertBanner bannerAlert={bannerAlert} />);

    expect(screen.getByText("Test Alert")).toBeInTheDocument();

    await testHelper.clickElement(screen.getByText("Close"));

    expect(screen.queryByText("Test Alert")).not.toBeInTheDocument();
  });

  it("should not render notification if it's closed", async () => {
    render(<AlertBanner bannerAlert={bannerAlert} />);

    await testHelper.clickElement(screen.getByText("Close"));

    expect(screen.queryByText("Test Alert")).not.toBeInTheDocument();
    expect(screen.queryByText("This is a test alert body text.")).not.toBeInTheDocument();
  });
});
