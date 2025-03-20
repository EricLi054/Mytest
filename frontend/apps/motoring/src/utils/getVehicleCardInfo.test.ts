import { describe, expect, it } from "vitest";

import { getVehicleCardInfo } from "./getVehicleCardInfo";

type VehicleDetails = Parameters<typeof getVehicleCardInfo>[0];

const mockVehicleDetails = {
  year: 2022,
  make: "honda",
  model: "civic",
  variant: "sport",
  body: "sedan",
  transmission: "auto",
  fuel: "petrol",
  kerbWeight: 1500,
  height: 1400,
  length: 4500,
  width: 1800,
} as const satisfies VehicleDetails;

const mockOversizedVehicleDetails = {
  year: 2022,
  make: "honda",
  model: "civic",
  variant: "sport",
  body: "sedan",
  transmission: "auto",
  fuel: "petrol",
  kerbWeight: 4500, // Exceeds MAX_VEHICLE_WEIGHT
  height: 3500, // Exceeds MAX_VEHICLE_HEIGHT
  length: 6000, // Exceeds MAX_VEHICLE_LENGTH
  width: 3000, // Exceeds MAX_VEHICLE_WIDTH
} as const satisfies VehicleDetails;

describe("getVehicleCardInfo", () => {
  it("should return success false when year is missing", () => {
    const incompleteDetails = { ...mockVehicleDetails, year: null } satisfies VehicleDetails;
    const result = getVehicleCardInfo(incompleteDetails);

    expect(result).toEqual({ success: false });
  });

  it("should return success false when make is missing", () => {
    const incompleteDetails = { ...mockVehicleDetails, make: null } satisfies VehicleDetails;
    const result = getVehicleCardInfo(incompleteDetails);

    expect(result).toEqual({ success: false });
  });

  it("should return success false when model is missing", () => {
    const incompleteDetails = { ...mockVehicleDetails, model: null } satisfies VehicleDetails;
    const result = getVehicleCardInfo(incompleteDetails);

    expect(result).toEqual({ success: false });
  });

  it("should return correct vehicle info for normal-sized vehicle and convert to uppercase", () => {
    const result = getVehicleCardInfo(mockVehicleDetails);

    expect(result).toEqual({
      success: true,
      title: "2022 HONDA",
      subtitle: "CIVIC SPORT SEDAN AUTO PETROL",
      isOverweightOrOversize: false,
    } satisfies ReturnType<typeof getVehicleCardInfo>);
  });

  it("should return correct vehicle info for oversized vehicle and convert to uppercase", () => {
    const result = getVehicleCardInfo(mockOversizedVehicleDetails);

    expect(result).toEqual({
      success: true,
      title: "2022 HONDA",
      subtitle: "CIVIC SPORT SEDAN AUTO PETROL",
      isOverweightOrOversize: true,
    } satisfies ReturnType<typeof getVehicleCardInfo>);
  });
});
