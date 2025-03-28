import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoadingProvider } from "#providers/loading/index";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RequestPhysicalCardResponse } from "./types";
import CardRequestForm from ".";

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));

const cardAlreadyOrderedResponse: RequestPhysicalCardResponse = {
  requestPhysicalCard: {
    physicalCardResponse: null,
    errors: [
      {
        __typename: "PhysicalCardAlreadyOrdered",
      },
    ],
  },
};

const successResponse: RequestPhysicalCardResponse = {
  requestPhysicalCard: {
    physicalCardResponse: {
      value: "Physical card request successful",
      isSuccess: true,
    },
    errors: null,
  },
};

const requestPhysicalCardHandler = (expectedResponse: RequestPhysicalCardResponse) => () =>
  Promise.resolve(expectedResponse);

const mockAddress = "123 Fake St";

describe("CardRequestForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the page with correct member address", () => {
    render(
      <LoadingProvider>
        <CardRequestForm
          unmaskedFormattedAddress={mockAddress}
          requestPhysicalCard={requestPhysicalCardHandler(successResponse)}
        />
      </LoadingProvider>,
    );

    expect(screen.getByText("123 Fake St")).toBeVisible();
    expect(screen.getByRole("button", { name: "Request card" })).toBeVisible();
  });

  it("should navigate to success page when submitting card request with success response", async () => {
    render(
      <LoadingProvider>
        <CardRequestForm
          unmaskedFormattedAddress={mockAddress}
          requestPhysicalCard={requestPhysicalCardHandler(successResponse)}
        />
      </LoadingProvider>,
    );

    const button = screen.getByRole("button", { name: "Request card" });
    await userEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/myrac/profile/membership/request-a-card/card-request-sent");
  });

  it("should navigate to error page when submitting card request with unhandled error", async () => {
    render(
      <LoadingProvider>
        <CardRequestForm
          unmaskedFormattedAddress={mockAddress}
          requestPhysicalCard={requestPhysicalCardHandler(null)}
        />
      </LoadingProvider>,
    );

    const button = screen.getByRole("button", { name: "Request card" });
    await userEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/something-went-wrong");
  });

  it("should navigate to duplicate-card-error page when submitting a duplicate request", async () => {
    render(
      <LoadingProvider>
        <CardRequestForm
          unmaskedFormattedAddress={mockAddress}
          requestPhysicalCard={requestPhysicalCardHandler(cardAlreadyOrderedResponse)}
        />
      </LoadingProvider>,
    );

    const button = screen.getByRole("button", { name: "Request card" });
    await userEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/myrac/profile/membership/request-a-card/card-already-requested");
  });

  it("should trigger GA event when clicking on contact details link", async () => {
    render(
      <LoadingProvider>
        <CardRequestForm
          unmaskedFormattedAddress={mockAddress}
          requestPhysicalCard={requestPhysicalCardHandler(successResponse)}
        />
      </LoadingProvider>,
    );

    await testHelper.clickText("contact details", screen);

    expect(logEvent).toHaveBeenCalledWith("Update address in your contact details");
  });

  it("should trigger GA event when submitting a Card Request", async () => {
    render(
      <LoadingProvider>
        <CardRequestForm
          unmaskedFormattedAddress={mockAddress}
          requestPhysicalCard={requestPhysicalCardHandler(successResponse)}
        />
      </LoadingProvider>,
    );

    await testHelper.clickButton("Request card", screen);

    expect(logEvent).toHaveBeenCalledWith("Request card");
  });
});
