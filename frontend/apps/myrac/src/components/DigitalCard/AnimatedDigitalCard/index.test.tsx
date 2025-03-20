import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMobileSwipe } from "@racwa/ui";

import type { AnimatedDigitalCardProps } from "./";
import AnimatedDigitalCard from "./";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

vi.mock("@racwa/ui", () => ({
  useMobileSwipe: vi.fn(),
}));

const props: AnimatedDigitalCardProps = {
  person: {
    title: "Mr",
    firstName: "John",
    surname: "Doe",
    cardColour: "Blue",
    racId: "12345678",
    membershipCardNumber: "1234567890123456",
    membershipType: "Gold",
    tier: "Gold",
  },
};

describe("AnimatedDigitalCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(<AnimatedDigitalCard {...props} />);

    expect(screen.getByText("Show barcode")).toBeInTheDocument();
  });

  it("should toggle barcode visibility on click", async () => {
    render(<AnimatedDigitalCard {...props} />);

    const toggleButton = screen.getByText("Show barcode");

    await userEvent.click(toggleButton);

    expect(screen.getByText("Hide barcode")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Hide barcode"));

    expect(screen.getByText("Show barcode")).toBeInTheDocument();
  });

  it("should toggle barcode visibility on swipe when membershipCardNumber is defined", () => {
    const swipeHandlers = {
      onTouchEnd: vi.fn(),
      onTouchMove: vi.fn(),
      onTouchStart: vi.fn(),
    };

    vi.mocked(useMobileSwipe).mockReturnValue(swipeHandlers);

    render(<AnimatedDigitalCard {...props} />);

    simulateSwipe(screen.getByTestId("flippable-card"), 40, 1, 100, 1);

    expect(swipeHandlers.onTouchStart).toHaveBeenCalled();
    expect(swipeHandlers.onTouchMove).toHaveBeenCalled();
    expect(swipeHandlers.onTouchEnd).toHaveBeenCalled();
  });

  const simulateSwipe = (element: HTMLElement, startX: number, startY: number, endX: number, endY: number) => {
    fireEvent.touchStart(element, { targetTouches: [{ clientX: startX, clientY: startY }] });
    fireEvent.touchMove(element, { targetTouches: [{ clientX: endX, clientY: endY }] });
    fireEvent.touchEnd(element);
  };
});
