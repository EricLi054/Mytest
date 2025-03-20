import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ShareButton from ".";

describe("ShareButton", () => {
  const mockHeading = "Test Heading";
  const mockLeadParagraph = "Test Lead Paragraph";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the IconButton when navigator.share is supported", () => {
    Object.defineProperty(navigator, "share", {
      value: vi.fn(),
      configurable: true,
    });

    render(<ShareButton heading={mockHeading} leadParagraph={mockLeadParagraph} />);

    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
  });

  it("should call navigator.share with correct arguments when IconButton is clicked", async () => {
    const shareMock = vi.fn();
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      configurable: true,
    });

    render(<ShareButton heading={mockHeading} leadParagraph={mockLeadParagraph} />);

    const shareButton = screen.getByRole("button", { name: /share/i });
    await userEvent.click(shareButton);

    expect(shareMock).toHaveBeenCalledWith({
      title: `${mockHeading} - RAC Horizons`,
      text: mockLeadParagraph,
      url: window.location.href,
    });
  });

  it("should log an error if navigator.share throws an error", async () => {
    const shareMock = vi.fn(() => {
      throw new Error("Test error");
    });
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      configurable: true,
    });

    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => []);

    render(<ShareButton heading={mockHeading} leadParagraph={mockLeadParagraph} />);

    const shareButton = screen.getByRole("button", { name: /share/i });
    await userEvent.click(shareButton);

    expect(consoleErrorMock).toHaveBeenCalledWith("Error sharing:", new Error("Test error"));

    consoleErrorMock.mockRestore();
  });
});
