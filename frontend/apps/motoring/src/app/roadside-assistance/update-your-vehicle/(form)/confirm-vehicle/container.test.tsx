import { useActionState } from "react";
import { render, screen } from "@testing-library/react";
import { mockConfirmVehicleContentfulData } from "#mocks/contentful";
import { useFormStatus } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmVehicleContainer } from "./container";

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

describe("ConfirmVehicleContainer", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
    vi.mocked(useFormStatus).mockReturnValue({ pending: false, data: null, method: null, action: null });
  });

  it("should be able to render", () => {
    render(
      <ConfirmVehicleContainer
        confirmVehicleAction={vi.fn()}
        vehicleCardInfo={{
          title: "2021 TOYOTA",
          subtitle: "CAMRY SEDAN LE",
          vehicleType: "CAR",
          isOverweightOrOversize: false,
          registration: "ABC123",
          colour: "BLUE",
        }}
        contentfulData={mockConfirmVehicleContentfulData}
      />,
    );

    expect(screen.getByText("Confirm this is your vehicle")).toBeVisible();
    expect(screen.getByText("2021 TOYOTA")).toBeVisible();
    expect(screen.getByText("CAMRY SEDAN LE")).toBeVisible();
    expect(screen.getByText("Registration:")).toBeVisible();
    expect(screen.getByText("ABC123")).toBeVisible();
    expect(screen.getByText("Vehicle colour:")).toBeVisible();
    expect(screen.getByText("BLUE")).toBeVisible();
  });
});
