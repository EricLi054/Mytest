import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DialogButtons from ".";
import { VerifyButtonState } from "../../types";

describe("DialogButtons", () => {
  it("should render when active state is VerifyButtonState ToVerify", () => {
    render(<DialogButtons activeState={VerifyButtonState.ToVerify} />);

    const button = screen.getByRole("button", { name: "Verify" });

    expect(button).toBeVisible();
    expect(button).not.toBeDisabled();
  });

  it("should render when active state is VerifyButtonState Verifying", () => {
    render(<DialogButtons activeState={VerifyButtonState.Verifying} />);

    const button = screen.getByRole("button", { name: "Verifying" });

    expect(button).toBeVisible();
    expect(button).toBeDisabled();
  });

  it("should render when active state is VerifyButtonState Verified", () => {
    render(<DialogButtons activeState={VerifyButtonState.Verified} />);

    const button = screen.getByRole("button", { name: "Verified" });

    expect(button).toBeVisible();
    expect(button).not.toBeDisabled();
  });

  it("should render when active state is VerifyButtonState Disabled", () => {
    render(<DialogButtons activeState={VerifyButtonState.Disabled} />);

    const button = screen.getByRole("button", { name: "Verify" });

    expect(button).toBeVisible();
    expect(button).toBeDisabled();
  });
});
