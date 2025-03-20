import "#components/Analytics/index";

import type { RenderResult } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectGtmFieldTouched } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import IdentificationMethodRadioGroup from ".";
import IdentificationMethodRadioItem from "../IdentificationMethodRadioItem";

vi.mock("server-only", () => ({}));

describe("IdentificationMethodRadioGroup", () => {
  const initialise = (): RenderResult => {
    return render(
      <IdentificationMethodRadioGroup defaultValue="test-one">
        <IdentificationMethodRadioItem label="Test radio item one" value="test-one" checked={true} />
        <IdentificationMethodRadioItem label="Test radio item two" value="test-two" checked={false} />
        <IdentificationMethodRadioItem label="Test radio item three" value="test-three" checked={false} />
      </IdentificationMethodRadioGroup>,
    );
  };

  it("should be able to render", () => {
    initialise();

    expect(screen.getByText("Select an option to verify your identity")).toBeVisible();
    expect(screen.getByText("Test radio item one")).toBeVisible();
    expect(screen.getByText("Test radio item two")).toBeVisible();
    expect(screen.getByText("Test radio item three")).toBeVisible();
  });

  it("should set radio option to checked when clicked", async () => {
    const user = userEvent.setup();
    initialise();

    expect(screen.getByLabelText("Test radio item one")).toBeChecked();

    const optionTwo = screen.getByLabelText("Test radio item two");
    await user.click(optionTwo);

    expect(optionTwo).toBeChecked();

    const optionThree = screen.getByLabelText("Test radio item three");
    await user.click(optionThree);

    expect(optionThree).toBeChecked();
  });

  describe("Analytics", () => {
    it("should send gtm message on change", async () => {
      const user = userEvent.setup();
      initialise();

      await user.click(screen.getByText("Test radio item two"));

      expectGtmFieldTouched("Select an option to verify your identity");
    });
  });
});
