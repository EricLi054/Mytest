import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectGtmCustomEvent } from "#testing/analytics";
import { EMPTY_URL } from "#utils/constants";
import { describe, it } from "vitest";

import RacHomeErrorPageButton from ".";

describe("RacHomeErrorPageButton", () => {
  it("should raise GTM event when clicked", async () => {
    const user = userEvent.setup();
    render(<RacHomeErrorPageButton racHomePageUrl={EMPTY_URL} />);

    await user.click(screen.getByRole("link"));

    expectGtmCustomEvent("RAC homepage");
  });
});
