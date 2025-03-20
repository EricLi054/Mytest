import { render, screen } from "@testing-library/react";
import { mockConfirmVehicleContentfulData } from "#mocks/mockContentful";
import { describe, expect, it, vi } from "vitest";

import type { ConfirmVehicleProps } from "./container";
import { ConfirmVehicleContainer } from "./container";

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
  vehicleCardInfo: {
    title: "2021 TOYOTA",
    subtitle: "CAMRY SEDAN LE",
    vehicleType: "CAR",
    isOverweightOrOversize: false,
    registration: "ABC123",
    colour: "BLUE",
  },
  contentfulData: mockConfirmVehicleContentfulData,
  confirmVehicleAction: vi.fn(),
} satisfies ConfirmVehicleProps;

describe("ConfirmVehicleContainer", () => {
  it("should be able to render", () => {
    render(<ConfirmVehicleContainer {...mockProps} />);

    expect(screen.getByText("Confirm this is your vehicle")).toBeVisible();
    expect(screen.getByText("2021 TOYOTA")).toBeVisible();
    expect(screen.getByText("CAMRY SEDAN LE")).toBeVisible();
    expect(screen.getByText("Registration:")).toBeVisible();
    expect(screen.getByText("ABC123")).toBeVisible();
    expect(screen.getByText("Vehicle colour:")).toBeVisible();
    expect(screen.getByText("BLUE")).toBeVisible();
  });
});
