import type { Mock } from "vitest";
import { useActionState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUpdateVehicleContentfulData } from "#mocks/contentful";
import { useFormStatus } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UpdateVehicleFormProps } from "./form";
import { getVehicleByRego } from "./actions";
import UpdateVehicleForm from "./form";

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

vi.mock("./actions", () => ({
  getVehicleByRego: vi.fn(),
}));

const mockGetVehicleByRego = getVehicleByRego as Mock;

const mockProps: UpdateVehicleFormProps = {
  contentfulData: mockUpdateVehicleContentfulData,
  updateVehicleAction: vi.fn(),
  getVehicleByRegoAction: mockGetVehicleByRego,
};

describe("UpdateVehicleForm", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
    vi.mocked(useFormStatus).mockReturnValue({ pending: false, data: null, method: null, action: null });
  });

  it("should render with form fields", () => {
    render(<UpdateVehicleForm {...mockProps} />);

    expect(screen.getByText("Type of vehicle you're updating to")).toBeVisible();
    expect(screen.getByLabelText("Car")).toBeVisible();
    expect(screen.getByLabelText("Motorcycle")).toBeVisible();

    expect(screen.queryByText("Enter your registration to find your vehicle")).toBeNull();
    expect(screen.queryByPlaceholderText("e.g. RAC123")).toBeNull();

    expect(screen.getByRole("button", { name: /Next/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /Back/i })).toBeVisible();
  });

  it("should handle vehicle type change", async () => {
    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    const motorcycleRadioButton = screen.getByLabelText("Motorcycle");

    await userEvent.click(motorcycleRadioButton);

    expect(motorcycleRadioButton).toHaveAttribute("aria-pressed", "true");
    expect(carRadioButton).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(carRadioButton);

    expect(carRadioButton).toHaveAttribute("aria-pressed", "true");
    expect(motorcycleRadioButton).toHaveAttribute("aria-pressed", "false");
  });

  it("should display rego input field after vehicle type is selected", async () => {
    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    await userEvent.click(carRadioButton);

    expect(screen.getByText("Enter your registration to find your vehicle")).toBeVisible();
    expect(screen.getByPlaceholderText("e.g. RAC123")).toBeVisible();
  });

  it("should handle vehicle registration input", async () => {
    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    await userEvent.click(carRadioButton);

    const regoInput = screen.getByPlaceholderText("e.g. RAC123");

    await userEvent.type(regoInput, "2RAC456");

    expect(regoInput).toHaveValue("2RAC456");
  });

  it("should limit vehicle registration input to 9 characters", async () => {
    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    await userEvent.click(carRadioButton);

    const regoInput = screen.getByPlaceholderText("e.g. RAC123");

    await userEvent.type(regoInput, "1234567890");

    expect(regoInput).toHaveValue("123456789");
  });

  it.each(["RAC@123", "RAC-123"])(
    "should show validation errors on invalid vehicle registration input '%s'",
    async (invalidRegistrationNumber: string) => {
      render(<UpdateVehicleForm {...mockProps} />);

      const carRadioButton = screen.getByLabelText("Car");
      await userEvent.click(carRadioButton);

      const regoInput = screen.getByPlaceholderText("e.g. RAC123");

      await userEvent.type(regoInput, invalidRegistrationNumber);

      const searchButton = screen.getByRole("button", { name: /Search/i });

      await userEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("Please search with your registration")).toBeVisible();
      });
    },
  );

  it("should show validation errors", async () => {
    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    await userEvent.click(carRadioButton);

    const searchButton = screen.getByRole("button", { name: /Search/i });

    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Please search with your registration")).toBeVisible();
    });
  });

  it("should remove spaces from vehicle registration input on submit", async () => {
    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    await userEvent.click(carRadioButton);

    const regoInput = screen.getByPlaceholderText("e.g. RAC123");

    await userEvent.type(regoInput, " RAC 123 ");

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(mockGetVehicleByRego).toHaveBeenCalledWith({
        registrationNumber: "RAC123",
        vehicleType: "CAR",
      });
    });
  });

  it("should show notification card for oversized vehicle", async () => {
    mockGetVehicleByRego.mockResolvedValue({
      title: "2022 HONDA",
      subtitle: "CIVIC SPORT SEDAN AUTO PETROL BLUE",
      isOverweightOrOversize: true,
    });

    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    await userEvent.click(carRadioButton);

    const regoInput = screen.getByPlaceholderText("e.g. RAC123");
    await userEvent.clear(regoInput);
    await userEvent.type(regoInput, "2RAC456");

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(mockGetVehicleByRego).toHaveBeenCalledWith({
        registrationNumber: "2RAC456",
        vehicleType: "CAR",
      });
    });

    const vehicleCard = screen.getByRole("button", { name: "Select" });
    await userEvent.click(vehicleCard);

    await waitFor(() => {
      expect(screen.getByText("Oversize or Overweight Vehicle")).toBeVisible();
    });
  });

  it("should not show notification card for normal-sized vehicle", async () => {
    const mockGetVehicleByRego = getVehicleByRego as Mock;
    mockGetVehicleByRego.mockResolvedValue({
      title: "2022 HONDA",
      subtitle: "CIVIC SPORT SEDAN AUTO PETROL BLUE",
      isOverweightOrOversize: false,
    });

    render(<UpdateVehicleForm {...mockProps} />);

    const carRadioButton = screen.getByLabelText("Car");
    await userEvent.click(carRadioButton);

    const regoInput = screen.getByPlaceholderText("e.g. RAC123");
    await userEvent.clear(regoInput);
    await userEvent.type(regoInput, "2RAC456");

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(mockGetVehicleByRego).toHaveBeenCalledWith({
        registrationNumber: "2RAC456",
        vehicleType: "CAR",
      });
    });

    const vehicleCard = screen.getByRole("button", { name: "Select" });
    await userEvent.click(vehicleCard);

    await waitFor(() => {
      expect(screen.queryByText("Oversize or Overweight Vehicle")).toBeNull();
    });
  });

  // TODO: Add test for form submission when this issue is resolved https://github.com/vercel/next.js/issues/54757
  it.todo("should handle form submission");
});
