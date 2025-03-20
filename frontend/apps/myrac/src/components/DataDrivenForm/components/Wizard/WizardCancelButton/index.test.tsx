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

const testSchema = [
  {
    name: "cancel",
    component: "wizard-cancel-button",
    label: "Cancel",
    modalTitle: "Are you sure you want to cancel?",
    confirmText: "Yes, please cancel",
    cancelText: "No, go back",
  },
];

describe("Wizard Cancel Button", () => {
  it("should render button", () => {
    render(<TestFormRenderer fields={testSchema} />);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  it("should show confirmation modal on click", async () => {
    render(<TestFormRenderer fields={testSchema} />);
    await testHelper.clickButton("Cancel", screen);

    expect(screen.getByText("Are you sure you want to cancel?")).toBeVisible();
  });

  it("should close modal without going back on cancel click", async () => {
    render(<TestFormRenderer fields={testSchema} />);

    await testHelper.clickButton("Cancel", screen);
    await testHelper.clickButton("No, go back", screen);

    expect(handlePrevMock).toBeCalledTimes(0);
  });

  it("should go back to previous step on confirm click", async () => {
    render(<TestFormRenderer fields={testSchema} />);

    await testHelper.clickButton("Cancel", screen);
    await testHelper.clickButton("Yes, please cancel", screen);

    expect(handlePrevMock).toBeCalledTimes(1);
  });
});
