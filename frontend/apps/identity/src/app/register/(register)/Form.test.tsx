import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFormAction } from "#testing";
import { expectGtmCustomEvent, expectGtmFieldTouched } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import RegisterForm from "./Form";

vi.mock("server-only", () => ({}));
vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    useFormStatus: vi.fn().mockReturnValue({ pending: false }),
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  };
});

describe("RegisterForm", () => {
  const renderForm = () => render(<RegisterForm formAction={mockFormAction} />);

  it("should not continue until you have accepted the Terms", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByText("Set up your digital identity")).toBeVisible();
    expect(screen.queryByText("Please accept the Terms and Conditions")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Get started" }));

    expect(screen.getByText("Please accept the Terms and Conditions")).toBeVisible();

    await user.click(screen.getByRole("checkbox"));

    expect(screen.queryByText("Please accept the Terms and Conditions")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Get started" }));
  });

  describe("Analytics", () => {
    it("should send gtm message for the Terms link", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByText("Terms and Conditions"));
      expectGtmCustomEvent("Terms and Conditions");
    });

    it("should send gtm message for the Cancel link", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByText("Cancel"));
      expectGtmCustomEvent("Cancel");
    });

    it("should send gtm message for the checkbox interaction", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole("checkbox"));
      expectGtmFieldTouched("Terms and Conditions");
    });

    it("should send gtm message for the validation error", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole("button", { name: "Get started" }));

      expect(screen.getByText("Please accept the Terms and Conditions")).toBeVisible();

      expectGtmCustomEvent("Please accept the terms and conditions error validation");
    });
  });
});
