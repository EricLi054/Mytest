import { render, screen } from "@testing-library/react";
import { mockFormStatus } from "#testing/react-dom";
import { useFormStatus } from "react-dom";
import { describe, expect, it, vi } from "vitest";

import SubmitButton from ".";

vi.mock("react-dom", () => ({
  useFormStatus: vi.fn(() => mockFormStatus({ pending: false })),
}));

describe("SubmitButton", () => {
  it("should have text content 'Next' when not pending and no label is provided", () => {
    vi.mocked(useFormStatus).mockImplementation(() => mockFormStatus({ pending: false }));
    render(<SubmitButton>Next</SubmitButton>);

    const submitButton = screen.getByRole("button", { name: "Next" });

    expect(submitButton).toBeVisible();
  });

  it("should have text content 'Submit' when not pending and label is provided", () => {
    vi.mocked(useFormStatus).mockImplementation(() => mockFormStatus({ pending: false }));
    render(<SubmitButton>Submit</SubmitButton>);

    const submitButton = screen.getByRole("button", { name: "Submit" });

    expect(submitButton).toBeVisible();
  });

  it("should be disabled when disabled is true", () => {
    vi.mocked(useFormStatus).mockImplementation(() => mockFormStatus({ pending: false }));
    render(<SubmitButton disabled>Next</SubmitButton>);

    const submitButton = screen.getByRole("button", { name: "Next" });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it("should be disabled when pending is true", () => {
    vi.mocked(useFormStatus).mockImplementation(() => mockFormStatus({ pending: true }));
    render(<SubmitButton>Submit</SubmitButton>);

    const submitButton = screen.getByRole("button", { name: "Submit" });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeDisabled();
  });
});
