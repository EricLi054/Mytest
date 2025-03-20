import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectGtmCustomEvent, expectGtmCustomEventToNotHaveBeenCalled } from "#testing/analytics";
import { describe, expect, it } from "vitest";

import PhoneLink, { RacPhoneLink, RegistrationPhoneLink } from ".";

describe("PhoneLink", () => {
  const getLink = (name: string) => screen.getByRole("link", { name });

  it("should be able to render", () => {
    const displayNumber = "10 20 30";
    render(<PhoneLink displayNumber={displayNumber} />);

    const phoneLink = getLink(displayNumber);

    expect(phoneLink).toBeVisible();
    expect(phoneLink).toHaveAttribute("href", "tel:102030");
  });

  it("should send an analytics message on click", async () => {
    const displayNumber = "10 20 30";
    const expectedEventDescription = "My event";
    const user = userEvent.setup();
    render(<PhoneLink displayNumber={displayNumber} analyticsEvent={expectedEventDescription} />);

    await user.click(getLink(displayNumber));

    expectGtmCustomEvent(expectedEventDescription);
  });

  describe("RacPhoneLink", () => {
    const displayNumber = "13 17 03";

    it("should not send default analytics message on click", async () => {
      const user = userEvent.setup();
      render(<RacPhoneLink />);

      await user.click(getLink(displayNumber));

      expectGtmCustomEventToNotHaveBeenCalled();
    });

    it("should send a custom analytics message on click", async () => {
      const expectedEventDescription = "My event";
      const user = userEvent.setup();
      render(<RacPhoneLink analyticsEvent={expectedEventDescription} />);

      await user.click(getLink(displayNumber));

      expectGtmCustomEvent(expectedEventDescription);
    });
  });

  describe("RegistrationPhoneLink", () => {
    const displayNumber = "1300 045 617";

    it("should send default analytics message on click", async () => {
      const user = userEvent.setup();
      render(<RegistrationPhoneLink />);

      await user.click(getLink(displayNumber));

      expectGtmCustomEvent(displayNumber);
    });

    it("should send a custom analytics message on click", async () => {
      const expectedEventDescription = "My event";
      const user = userEvent.setup();
      render(<RegistrationPhoneLink analyticsEvent={expectedEventDescription} />);

      await user.click(getLink(displayNumber));

      expectGtmCustomEvent(expectedEventDescription);
    });
  });
});
