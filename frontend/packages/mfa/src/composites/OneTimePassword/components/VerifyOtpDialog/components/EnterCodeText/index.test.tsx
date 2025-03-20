import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EnterCodeText from ".";

describe("EnterCodeText", () => {
  const defaultCopy = "Please enter the code to verify it's you.";

  it("should render when isSms is false", () => {
    render(<EnterCodeText isSms={false} />);

    expect(screen.getByText(defaultCopy)).toBeVisible();
  });

  it.each([undefined, ""])(
    "should render when isSms is true and phoneNumberSuffix is [%s]",
    (invalidPhoneNumberSuffix) => {
      render(<EnterCodeText isSms={true} phoneNumberSuffix={invalidPhoneNumberSuffix} />);

      expect(screen.getByText(defaultCopy)).toBeVisible();
    },
  );

  it("should render when isSms is true and phoneNumberSuffix valid", () => {
    const suffix = "123";
    render(<EnterCodeText isSms={true} phoneNumberSuffix={suffix} />);

    expect(screen.getByText(`We've sent an SMS to 04** *** ${suffix}. ${defaultCopy}`)).toBeVisible();
  });
});
