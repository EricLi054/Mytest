import type { ComponentItem } from "#types/horizons/componentItem";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ComponentSwitcher from "./";

vi.mock("server-only", () => ({}));

vi.mock("../cms/ctaBanner", () => ({
  __esModule: true,
  default: vi.fn(() => <div>CTA Banner Component</div>),
}));
vi.mock("../cms/featuredContent", () => ({
  __esModule: true,
  default: vi.fn(() => <div>FeaturedContent Component</div>),
}));
vi.mock("../cms/filterableContent", () => ({
  __esModule: true,
  default: vi.fn(() => <div>FilterableContent Component</div>),
}));
vi.mock("../cms/pageHeader", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Page Header Component</div>),
}));
vi.mock("../cms/button", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Button Component</div>),
}));
vi.mock("../cms/typography", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Typography Component</div>),
}));
vi.mock("../cms/videoCarousel", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Video Carousel Component</div>),
}));

describe("ComponentSwitcher", () => {
  it("should render CTA Banner component for CtaBanner type", () => {
    const mockComponent: ComponentItem = {
      __typename: "CtaBanner",
      sys: { id: "cta-banner-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("CTA Banner Component")).toBeInTheDocument();
  });

  it("should render FeaturedContent component for FeaturedContent type", () => {
    const mockComponent: ComponentItem = {
      __typename: "FeaturedContent",
      sys: { id: "featured-content-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("FeaturedContent Component")).toBeInTheDocument();
  });

  it("should render FilterableContent component for FilterableContent type", () => {
    const mockComponent: ComponentItem = {
      __typename: "FilterableContent",
      sys: { id: "filterable-content-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("FilterableContent Component")).toBeInTheDocument();
  });

  it("should render PageHeader component for PageHeader type", () => {
    const mockComponent: ComponentItem = {
      __typename: "PageHeader",
      sys: { id: "page-header-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("Page Header Component")).toBeInTheDocument();
  });

  it("should render Typography component for Typography type", () => {
    const mockComponent: ComponentItem = {
      __typename: "Typography",
      sys: { id: "typography-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("Typography Component")).toBeInTheDocument();
  });

  it("should render the Video Carousel component for Video Carousel type", () => {
    const mockComponent: ComponentItem = {
      __typename: "VideoCarousel",
      sys: { id: "video-carousel-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("Video Carousel Component")).toBeInTheDocument();
  });

  it("should render Button component for Button type", () => {
    const mockComponent: ComponentItem = {
      __typename: "Button",
      sys: { id: "button-id" },
    };

    render(<ComponentSwitcher component={mockComponent} />);

    expect(screen.getByText("Button Component")).toBeInTheDocument();
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
