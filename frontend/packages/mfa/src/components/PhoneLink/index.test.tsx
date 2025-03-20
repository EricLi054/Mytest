import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it } from "vitest";

import { PhoneLink } from ".";

describe("PhoneLink", () => {
  const expectedDisplayNumber = "13 17 03";

  const getLink = () => screen.getByRole("link", { name: expectedDisplayNumber });

  it("should be able to render", () => {
    render(<PhoneLink displayNumber={expectedDisplayNumber} />);

    const phoneLink = getLink();

    expect(phoneLink).toBeVisible();
    expect(phoneLink).toHaveAttribute("href", "tel:131703");
  });

  it("should send an analytics message on click", async () => {
    const expectedEventDescription = "My event";
    const user = userEvent.setup();
    render(<PhoneLink displayNumber={expectedDisplayNumber} analyticsEvent={expectedEventDescription} />);

    await user.click(getLink());

    expectGtmCustomEvent(expectedEventDescription);
  });
});
