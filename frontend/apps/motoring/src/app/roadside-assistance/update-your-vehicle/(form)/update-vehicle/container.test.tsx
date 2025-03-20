import { render, screen } from "@testing-library/react";
import { mockUpdateVehicleContentfulData } from "#mocks/mockContentful";
import { describe, expect, it, vi } from "vitest";

import type { UpdateVehicleContainerProps } from "./container";
import UpdateVehicleContainer from "./container";

// Imported server action in form.tsx also imports server-only code
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

const mockProps = {
  contentfulData: mockUpdateVehicleContentfulData,
} as const satisfies UpdateVehicleContainerProps;

describe("UpdateVehicleContainer", () => {
  it("should be able to render", () => {
    render(<UpdateVehicleContainer {...mockProps} />);

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
