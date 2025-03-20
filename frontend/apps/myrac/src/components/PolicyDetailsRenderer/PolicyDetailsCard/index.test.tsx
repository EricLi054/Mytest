import { useMediaQuery } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "#utils/analyticsTagging";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PolicyDetailsCardContent } from "../types";
import PolicyDetailsCard from ".";

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: vi.fn().mockReturnValue(false),
  };
});

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

describe("PolicyDetailsCard", () => {
  const mockData: PolicyDetailsCardContent = {
    title: "Test Title",
    subtitle: "Test Subtitle",
    type: "RSA",
    alerts: [
      { severity: "info", message: "Info Message" },
      { severity: "warning", message: "Warning Message" },
      { severity: "error", message: "Error Message" },
      { severity: "info", message: "Phone Number:{13 17 03|tel:13 17 03}" },
    ],
    policyItems: [
      { label: "Item 1", value: "Value 1" },
      { label: "Item 2", value: "Value 2" },
    ],
    actions: [
      { label: "Action 1", type: "primary" },
      { label: "Action 2", type: "secondary" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the mobile version", async () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);
    render(<PolicyDetailsCard data={mockData} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Warning Message")).toBeInTheDocument();
    expect(screen.getByText("Action 1")).toBeInTheDocument();
    expect(screen.getByText("13 17 03")).toBeInTheDocument();

    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Info Message")).toBeInTheDocument();
    expect(screen.getByText("Error Message")).toBeInTheDocument();
    expect(screen.getByText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Value 2")).toBeInTheDocument();
    expect(screen.getByText("Action 2")).toBeInTheDocument();

    const title = screen.getByText("Test Title");
    const action = screen.getByText("Action 1");
    const warning = screen.getByText("Warning Message");

    expect(title.compareDocumentPosition(warning as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(4);
    expect(action.compareDocumentPosition(warning as Node) & Node.DOCUMENT_POSITION_PRECEDING).toBe(2);

    await userEvent.click(screen.getByText("Action 1"));

    expect(logEvent).toHaveBeenCalled();
  });

  it("should render the desktop version", async () => {
    vi.mocked(useMediaQuery).mockReturnValue(false);
    render(<PolicyDetailsCard data={mockData} />);

    const title = screen.getByText("Test Title");
    const action = screen.getByText("Action 1");
    const warning = screen.getByText("Warning Message");
    const phoneLink = screen.getByText("13 17 03");

    expect(title).toBeInTheDocument();
    expect(warning).toBeInTheDocument();
    expect(action).toBeInTheDocument();
    expect(phoneLink).toBeInTheDocument();

    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Info Message")).toBeInTheDocument();
    expect(screen.getByText("Error Message")).toBeInTheDocument();
    expect(screen.getByText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Value 2")).toBeInTheDocument();
    expect(screen.getByText("Action 2")).toBeInTheDocument();

    expect(title.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(4);
    expect(action.compareDocumentPosition(warning) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(4);

    await userEvent.click(screen.getByText("13 17 03"));

    expect(logEvent).toHaveBeenCalled();
  });

  it("should not render actions if not provided", () => {
    render(<PolicyDetailsCard data={{ ...mockData, actions: [] }} />);

    expect(screen.queryByText("Action 1")).toBeNull();
    expect(screen.queryByText("Action 2")).toBeNull();
  });

  it("should not render alerts if not provided", () => {
    render(<PolicyDetailsCard data={{ ...mockData, alerts: [] }} />);

    expect(screen.queryByText("Info Message")).toBeNull();
    expect(screen.queryByText("Warning Message")).toBeNull();
    expect(screen.queryByText("Error Message")).toBeNull();
    expect(screen.queryByText("13 17 03")).toBeNull();
  });

  it("should not render policy items if not provided", () => {
    const data = { ...mockData, policyItems: [] };
    render(<PolicyDetailsCard data={data} />);

    expect(screen.queryByText("Item 1")).toBeNull();
    expect(screen.queryByText("Value 1")).toBeNull();
    expect(screen.queryByText("Item 2")).toBeNull();
    expect(screen.queryByText("Value 2")).toBeNull();
  });

  it("should render a word tooltip and tests open/close", async () => {
    const data: PolicyDetailsCardContent = {
      ...mockData,
      policyItems: [
        {
          ...mockData.policyItems?.[0],
          paymentFrequency: {
            title: "Payment frequency",
            preMessage: "paying",
            frequency: "Monthly",
            message: "Your nominated Card is debited Monthly",
            linkText: "Change direct debit payment frequency",
            link: "/myrac/change-frequency?phhid=1234",
          },
        },
      ],
    };
    render(<PolicyDetailsCard data={data} />);

    await userEvent.click(screen.getByText("Monthly"));

    expect(screen.getByText("Your nominated Card is debited Monthly")).toBeVisible();

    const closeButton = screen.getByRole("button", { name: "close" });
    await userEvent.click(closeButton);

    expect(closeButton).not.toBeVisible();

    expect(logEvent).toHaveBeenCalled();
  });

  it("should render a property tooltip and tests the open / close", async () => {
    const data = {
      ...mockData,
      policyItems: mockData.policyItems
        ? mockData.policyItems.slice(0, 1).map((item) => ({
            ...item,
            tooltip: {
              title: "Repayment Method",
              message:
                "The repayment amount is the amount that appears on your loan contract and does not include any outstanding payments. Please contact {RAC Finance|tel:13 17 03} for further details.",
            },
          }))
        : [],
    };
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const result = render(<PolicyDetailsCard data={data} />);

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const tooltip = result.container.querySelector('[aria-label="show tooltip"]');

    expect(tooltip).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.click(tooltip!);

    expect(screen.getByText("Repayment Method")).toBeVisible();

    const closeButton = screen.getByRole("button", { name: "close" });
    await userEvent.click(closeButton);

    expect(closeButton).not.toBeVisible();

    expect(logEvent).toHaveBeenCalled();
  });
});
