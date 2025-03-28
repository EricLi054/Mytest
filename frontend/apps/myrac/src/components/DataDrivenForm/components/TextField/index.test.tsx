import type { Field } from "@data-driven-forms/react-form-renderer";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");

const testSchema = [
  {
    name: "firstName",
    component: "text-field",
    label: "First name",
    required: true,
    placeholder: "e.g. John",
    validate: [
      {
        type: "required",
        message: "Please enter a valid first name",
      },
    ],
    tooltipTitle: "Test tooltip",
    initialValue: "John",
    initializeOnMount: true,
  },
];

const testSchemaDisabled = [{ ...testSchema[0], disabled: true } as Field];

describe("Text Field", () => {
  it("should render control with initial value", () => {
    render(<TestFormRenderer fields={testSchema} />);

    const textbox = screen.getByRole("textbox");

    expect(textbox).toHaveValue("John");
    expect(textbox).toHaveAttribute("placeholder", "e.g. John");
    expect(textbox).not.toBeDisabled();
  });

  it("should display error message when in an error state", async () => {
    render(<TestFormRenderer fields={testSchema} />);

    const textbox = screen.getByRole("textbox");
    await userEvent.clear(textbox);

    expect(screen.getByText("Please enter a valid first name")).toBeVisible();
  });

  it("should have tooltip", async () => {
    render(<TestFormRenderer fields={testSchema} />);

    await testHelper.clickButton("show tooltip", screen);

    await waitFor(() => expect(screen.getByText("Test tooltip")).toBeVisible());
  });

  it("should display disabled state", () => {
    render(<TestFormRenderer fields={testSchemaDisabled} />);

    const textbox = screen.getByRole("textbox");

    expect(textbox).toHaveValue("John");
    expect(textbox).toBeDisabled();
  });
});
