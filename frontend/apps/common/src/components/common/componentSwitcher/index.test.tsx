import type { ComponentItem } from "#types/horizons/componentItem";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ComponentSwitcher from "./";

vi.mock("../faqSection", () => ({
  __esModule: true,
  default: vi.fn(() => <div>FAQ Section</div>),
}));

vi.mock("../contactMethods", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Contact Methods</div>),
}));

vi.mock("../webCardWrapper", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Web Card Wrapper Section</div>),
}));

describe("ComponentSwitcher", () => {
  it("should render FAQ Section component for FaqSection type", () => {
    const mockComponent: ComponentItem = {
      __typename: "FaqSection",
      sys: { id: "faq-section-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("FAQ Section")).toBeVisible();
  });

  it("should render Phone Number Section component for Contact Methods type", () => {
    const mockComponent: ComponentItem = {
      __typename: "ContactMethods",
      sys: { id: "contact-methods-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("Contact Methods")).toBeVisible();
  });

  it("should render Web Card Section component for WebCardWrapper type", () => {
    const mockComponent: ComponentItem = {
      __typename: "WebCardWrapper",
      sys: { id: "web-card-wrapper-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("Web Card Wrapper Section")).toBeVisible();
  });

  it("should return null for an unknown component type", () => {
    const mockComponent: ComponentItem = {
      __typename: "UnknownComponent",
      sys: { id: "unknown-id" },
    };

    const { container } = render(<ComponentSwitcher component={mockComponent} />);

    expect(container).toBeEmptyDOMElement();
  });
});
