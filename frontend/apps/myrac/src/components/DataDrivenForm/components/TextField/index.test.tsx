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

describe("Text Field", () => {
  it("should render control with initial value", () => {
    render(<TestFormRenderer fields={testSchema} />);

    const textbox = screen.getByRole("textbox");

    expect(textbox).toHaveValue("John");
    expect(textbox).toHaveAttribute("placeholder", "e.g. John");
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
});
