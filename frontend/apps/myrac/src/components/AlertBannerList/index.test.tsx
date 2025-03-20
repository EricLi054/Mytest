import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AlertBannerList from ".";
import { getBannerAlertsData } from "./data";

vi.mock("server-only", () => ({}));

vi.mock("./data", () => ({
  getBannerAlertsData: vi.fn(),
}));

describe("AlertBannerList", () => {
  it("should render a list of AlertBanners when data is available", async () => {
    const mockData = {
      items: [
        { title: "Test Alert 1", icon: "info-circle", bodyText: { json: {} } },
        { title: "Test Alert 2", icon: "exclamation-circle", bodyText: { json: {} } },
      ],
    };
    (getBannerAlertsData as Mock).mockResolvedValue(mockData);

    render(await AlertBannerList({ id: "123" }));

    expect(await screen.findByText("Test Alert 1")).toBeInTheDocument();

    expect(screen.getByText("Test Alert 1")).toBeInTheDocument();
    expect(screen.getByText("Test Alert 2")).toBeInTheDocument();
  });

  it("should render nothing when no data is available", async () => {
    (getBannerAlertsData as Mock).mockResolvedValue({ items: [] });

    render(await AlertBannerList({ id: "123" }));

    await waitFor(() => expect(screen.queryByText("Test Alert 1")).toBeNull());
  });

  it("should render nothing when data is undefined", async () => {
    (getBannerAlertsData as Mock).mockResolvedValue(undefined);

    render(await AlertBannerList({ id: "123" }));

    await waitFor(() => expect(screen.queryByText("Test Alert 1")).toBeNull());
  });
});
