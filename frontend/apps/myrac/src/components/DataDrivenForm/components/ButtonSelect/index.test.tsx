import { render, screen } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      refresh: refreshMock,
    };
  },
}));

const handlePrevMock = vi.fn();
vi.mock("../hooks", async () => {
  const actual = await vi.importActual("../hooks");

  return {
    ...actual,
    useWizardContext: () => {
      return {
        handlePrev: handlePrevMock,
      };
    },
  };
});

const testInitialValueSchema = [
  {
    name: "title",
    component: "button-select",
    label: "Title",
    required: true,
    validate: [
      {
        type: "required",
      },
    ],
    options: [
      {
        value: "Mr",
      },
      {
        value: "Mrs",
      },
      {
        value: "Miss",
      },
      {
        value: "Ms",
      },
      {
        value: "Mx",
      },
      {
        value: "Dr",
      },
    ],
    initialValue: "Mr",
    initializeOnMount: true,
  },
];

const testNoInitialValueSchema = [
  {
    name: "title",
    component: "button-select",
    label: "Title",
    required: true,
    validate: [
      {
        type: "required",
      },
    ],
    options: [
      {
        value: "Mr",
      },
      {
        value: "Mrs",
      },
      {
        value: "Miss",
      },
      {
        value: "Ms",
      },
      {
        value: "Mx",
      },
      {
        value: "Dr",
      },
    ],
  },
];

describe("Button Select", () => {
  it("should render control with initial value", () => {
    render(<TestFormRenderer fields={testInitialValueSchema} />);

    expect(screen.getByRole("button", { name: "Mr" })).toHaveAttribute("aria-pressed", "true");
  });

  it("should render control with no initial value", () => {
    render(<TestFormRenderer fields={testNoInitialValueSchema} />);

    expect(screen.getByRole("button", { name: "Mr" })).toHaveAttribute("aria-pressed", "false");
  });

  it("should change selected value on click", async () => {
    render(<TestFormRenderer fields={testInitialValueSchema} />);
    await testHelper.clickButton("Mrs", screen);

    expect(screen.getByRole("button", { name: "Mr" })).toHaveAttribute("aria-pressed", "false");

    expect(screen.getByRole("button", { name: "Mrs" })).toHaveAttribute("aria-pressed", "true");
  });
});
