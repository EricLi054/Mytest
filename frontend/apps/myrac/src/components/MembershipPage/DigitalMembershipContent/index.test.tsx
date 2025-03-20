import type { DigitalCardDetailsSchema, PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { render, screen } from "@testing-library/react";
import { ModalProvider } from "#providers/modal/index";
import { EngineeredContentCollection } from "#types/EngineeredJourneyProps/index";
import { describe, expect, it, vi } from "vitest";

import DigitalCardMembershipContent from ".";

library.add(fas);

vi.mock("server-only", () => ({}));

describe("DigitalCardMembershipContent", () => {
  const mockActiveDigitalCard: z.infer<typeof DigitalCardDetailsSchema> = {
    isActive: true,
    passId: "testing-123",
    passUrl: "https://www.example.com",
    numberOfPassesInstalled: 0,
    id: "",
  };

  it("should render the page with correct member details", () => {
    const mockPerson: z.infer<typeof PersonSchema> = {
      racId: "12345678",
      cardColour: "Blue",
      tier: "Blue",
      membershipCardNumber: "1234567890123456",
      title: null,
      firstName: "",
      surname: null,
      membershipType: "",
    };

    render(
      <ModalProvider>
        <DigitalCardMembershipContent
          person={mockPerson}
          digitalCardDetails={mockActiveDigitalCard}
          engineeredContent={new EngineeredContentCollection()}
          displayRequestCardLink={true}
        />
        ,
      </ModalProvider>,
    );

    expect(screen.getByTestId("digital-card-front")).toBeVisible();
    expect(screen.getByText("Get your digital card")).toBeVisible();
    expect(screen.getByText("Always in your phone.")).toBeVisible();
    expect(screen.getByText("Easy to redeem discounts.")).toBeVisible();
  });
});
