import { useActionState } from "react";
import { render, screen } from "@testing-library/react";
import { mockConfirmVehicleContentfulData } from "#mocks/contentful";
import { useFormStatus } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ConfirmVehicleForm from "./form";

vi.mock("server-only", () => ({}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

describe("ConfirmVehicleForm", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
    vi.mocked(useFormStatus).mockReturnValue({ pending: false, data: null, method: null, action: null });
  });

  it("should be able to render", () => {
    render(<ConfirmVehicleForm contentfulData={mockConfirmVehicleContentfulData} confirmVehicleAction={vi.fn()} />);

    expect(screen.getByText("Important Information")).toBeVisible();
    expect(screen.getByText("You can only update your vehicle once per product year.")).toBeVisible();
    expect(screen.getByText("Your vehicle must be licensed, roadworthy, and for private use only.")).toBeVisible();
    expect(
      screen.getByText("There are limitations for heavy or oversized vehicles. Extra charges may apply."),
    ).toBeVisible();
    expect(screen.getByText("Waiting periods may apply.")).toBeVisible();
    expect(screen.getByText("Refer to", { exact: false })).toBeVisible();
    expect(screen.getByText("Roadside Assistance Entitlements")).toBeVisible();
    expect(screen.getByText("for full terms and conditions.", { exact: false })).toBeVisible();
    expect(screen.getByRole("button", { name: /Confirm/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /Back/i })).toBeVisible();
  });
});
