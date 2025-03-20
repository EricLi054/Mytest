import type { PersonSchema } from "#graphql/person/queries/schema";
import type { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import type { z } from "zod";
import { BLOCKS } from "@contentful/rich-text-types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { render, screen } from "@testing-library/react";
import { ModalProvider } from "#providers/modal/index";
import { EngineeredContentCollection } from "#types/EngineeredJourneyProps";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import CardRequestSuccessPage from ".";

library.add(faEnvelope);

vi.mock("server-only", () => ({}));

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

vi.mock("#components/shared/useDeviceDetection", () => ({
  useDeviceDetection: vi.fn(),
}));

const heading: z.infer<typeof RichTextSchema> = {
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.HEADING_2,
        data: {},
        content: [
          {
            nodeType: "text",
            value: "John, your card will be on its way shortly",
            marks: [],
            data: {},
          },
        ],
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: "text",
            value: "It will arrive within 10 days.",
            marks: [],
            data: {},
          },
        ],
      },
    ],
  },
};

const engineeredContent = new EngineeredContentCollection(
  { contentId: "card-success-heading", richTextContent: heading },
  { contentId: "card-success-heading-icon", iconContent: "envelope", richTextContent: null },
  { contentId: "card-success-online-shop-card-icon", iconContent: "clock", richTextContent: null },
  { contentId: "card-success-online-shop-card-title", stringContent: "In the meantime...", richTextContent: null },
  {
    contentId: "card-success-digital-promo-card-title",
    stringContent: "Why not try a digital card?",
    richTextContent: null,
  },
  {
    contentId: "card-success-digital-promo-card-content",
    stringContent: "Easily redeem your discounts from your phone anytime.",
    richTextContent: null,
  },
);

const mockPerson: z.infer<typeof PersonSchema> = {
  racId: "12345678",
  cardColour: "Blue",
  tier: "Blue",
  membershipCardNumber: "123457890123456",
  title: null,
  firstName: "John",
  surname: null,
  membershipType: "",
  digitalCardDetails: {
    isActive: true,
    passId: "testing-123",
    passUrl: "https://www.example.com",
    numberOfPassesInstalled: 0,
    id: "",
  },
};

const mockPersonInactive = {
  ...mockPerson,
  digitalCardDetails: {
    ...mockPerson.digitalCardDetails,
    isActive: false,
  },
} as z.infer<typeof PersonSchema>;

describe("Card Request Success Page", () => {
  testHelper.mockDesktopDevice();

  it("should render the page with correct member details", () => {
    render(
      <ModalProvider>
        <CardRequestSuccessPage engineeredContent={engineeredContent} person={mockPerson} />
      </ModalProvider>,
    );

    expect(screen.getByText("John, your card will be on its way shortly")).toBeVisible();
  });

  it("should render inactive digital card content and check GA events", () => {
    render(
      <ModalProvider>
        <CardRequestSuccessPage engineeredContent={engineeredContent} person={mockPersonInactive} />
      </ModalProvider>,
    );

    expect(screen.getByText("John, your card will be on its way shortly")).toBeVisible();
    expect(screen.getByText("In the meantime...")).toBeVisible();

    expect(logEvent).toHaveBeenCalledWith("Member Central - Digital pass inactive");
  });

  it("should log GA event on Online Shop Link Click", async () => {
    render(
      <ModalProvider>
        <CardRequestSuccessPage engineeredContent={engineeredContent} person={mockPersonInactive} />
      </ModalProvider>,
    );

    const onlineShopLink = screen.getByRole("link", { name: "online shop" });

    expect(onlineShopLink).toBeVisible();
    expect(onlineShopLink).toHaveAttribute("href", "https://store.rac.com.au");

    await testHelper.clickLink("online shop", screen);

    expect(logEvent).toHaveBeenCalledWith("Redeem discounts in the online shop");
  });

  it("should render active digital card promo for desktop", async () => {
    render(
      <ModalProvider>
        <CardRequestSuccessPage engineeredContent={engineeredContent} person={mockPerson} />
      </ModalProvider>,
    );

    expect(screen.getByText("John, your card will be on its way shortly")).toBeVisible();
    expect(screen.getByText("Why not try a digital card?")).toBeVisible();
    expect(screen.getByText("Get a digital card now")).toBeVisible();

    await testHelper.clickText("Get a digital card now", screen);

    expect(screen.getByText("Get your digital card")).toBeInTheDocument();
  });

  it("should render active digital card promo for mobile", () => {
    testHelper.mockMobileDevice();
    render(
      <ModalProvider>
        <CardRequestSuccessPage engineeredContent={engineeredContent} person={mockPerson} />
      </ModalProvider>,
    );

    expect(screen.getByText("John, your card will be on its way shortly")).toBeVisible();
    expect(screen.getByText("Why not try a digital card?")).toBeVisible();
    expect(screen.getByRole("img", { name: "Add to Apple Wallet" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Add to Google Wallet" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Frequently asked questions" })).toBeVisible();
  });
});
