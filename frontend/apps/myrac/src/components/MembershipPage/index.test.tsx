import type { DigitalCardDetailsSchema, PersonSchema } from "#graphql/person/queries/schema";
import type { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import type { z } from "zod";
import { BLOCKS } from "@contentful/rich-text-types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { render, screen } from "@testing-library/react";
import { ModalProvider } from "#providers/modal/index";
import { EngineeredContentCollection } from "#types/EngineeredJourneyProps/index";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import MembershipPage from ".";

library.add(fas);

vi.mock("server-only", () => ({}));

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

vi.mock("#graphql/person/queries", () => ({
  getPerson: vi.fn(),
}));

const mockActiveDigitalCard: z.infer<typeof DigitalCardDetailsSchema> = {
  isActive: true,
  passId: "testing-123",
  passUrl: "https://www.example.com",
  numberOfPassesInstalled: 0,
  id: "",
};

const mockPerson: z.infer<typeof PersonSchema> = {
  racId: "12345678",
  cardColour: "Blue",
  tier: "Blue",
  membershipCardNumber: "123457890123456",
  title: null,
  firstName: "",
  surname: null,
  membershipType: "",
};

const mockPersonWithIgnite: z.infer<typeof PersonSchema> = {
  ...mockPerson,
  tier: "RAC Ignite",
};

const requestPhysicalCard: z.infer<typeof RichTextSchema> = {
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
            value: "Request Physical Card Element",
            marks: [],
            data: {},
          },
        ],
      },
    ],
  },
};

const mockedContent = new EngineeredContentCollection({
  contentId: "membership-request-card-link",
  richTextContent: requestPhysicalCard,
});

describe("EngineeredMembershipPage", () => {
  it("should render the page with correct member details", () => {
    render(
      <ModalProvider>
        <MembershipPage person={mockPerson} engineeredContent={new EngineeredContentCollection()} />
      </ModalProvider>,
    );

    expect(screen.getByText("Your membership")).toBeVisible();
    expect(screen.getByText("12345678")).toBeVisible();
    expect(screen.getByText("Tier")).toBeVisible();
    expect(screen.getByText("Blue member")).toBeVisible();
    expect(screen.getByTestId("digital-card-icon")).toBeVisible();
  });

  it("should logs to GA when clicked", async () => {
    render(
      <ModalProvider>
        <MembershipPage person={mockPerson} engineeredContent={new EngineeredContentCollection()} />
      </ModalProvider>,
    );

    await testHelper.clickTestId("digital-card-icon", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card icon click");
  });

  it("should hide request-plastic-card-link when member tier is ignite and digitalCardPassIsActive is not defined", () => {
    render(
      <ModalProvider>
        <MembershipPage person={mockPerson} engineeredContent={new EngineeredContentCollection()} />
      </ModalProvider>,
    );

    expect(screen.queryByText("Request Physical Card Element")).toBeNull();
  });

  it("should hide request-plastic-card-link when member tier is ignite and digitalCardPassIsActive is `true`", () => {
    mockPersonWithIgnite.digitalCardDetails = mockActiveDigitalCard;
    render(
      <ModalProvider>
        <MembershipPage person={mockPersonWithIgnite} engineeredContent={mockedContent} />
      </ModalProvider>,
    );

    expect(screen.queryByText("Request Physical Card Element")).toBeNull();
  });
});
