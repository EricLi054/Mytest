import { useActionState } from "react";
import { render, screen } from "@testing-library/react";
import { mockUpdateVehicleContentfulData } from "#mocks/contentful";
import { useFormStatus } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UpdateVehicleContainer from "./container";

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

describe("UpdateVehicleContainer", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
    vi.mocked(useFormStatus).mockReturnValue({ pending: false, data: null, method: null, action: null });
  });

  it("should be able to render", () => {
    render(<UpdateVehicleContainer contentfulData={mockUpdateVehicleContentfulData} />);

    expect(screen.getByText("Let's update your vehicle")).toBeVisible();
    expect(
      screen.getByText(
        "You can update your vehicle or just your registration. To get started, please search for your vehicle.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Type of vehicle you're updating to")).toBeVisible();
    expect(screen.getByLabelText("Car")).toBeVisible();
    expect(screen.getByLabelText("Motorcycle")).toBeVisible();

    expect(screen.getByRole("button", { name: /Next/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /Back/i })).toBeVisible();
  });
});
