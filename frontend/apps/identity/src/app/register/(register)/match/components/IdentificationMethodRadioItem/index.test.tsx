import type { RenderResult } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it } from "vitest";

import IdentificationMethodRadioItem from ".";

describe("IdentificationMethodRadioItem", () => {
  const label = "Test radio item";

  const initialise = (): RenderResult => {
    return render(<IdentificationMethodRadioItem label={label} value="test" checked={true} />);
  };

  it("should be able to render", () => {
    initialise();

    expect(screen.getByText("Test radio item")).toBeVisible();
    expect(screen.getByRole("radio", { name: `${label} identification method option` })).toBeChecked();
  });

  describe("Analytics", () => {
    it("should send gtm message for the radio item", async () => {
      const user = userEvent.setup();
      initialise();

      await user.click(screen.getByText(label));

      expectGtmCustomEvent(label);
    });
  });
});
