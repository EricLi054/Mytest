import { redirect } from "next/navigation";
import { mockTracer } from "#testing/otel";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UpdateYourVehicleSession } from "../../session/types";
import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../session";
import { confirmVehicle } from "./actions";
import { updateRoadsideVehicle } from "./data";

vi.mock("next/navigation");
vi.mock("../../session");
vi.mock("./data");

vi.mock("server-only", () => ({}));

vi.mock("@opentelemetry/api", () => ({
  trace: { getTracer: mockTracer },
}));

const mockUpdateYourVehicleSession = {
  crmId: "123",
  firstName: "John",
  productHoldingHeaderId: "123",
  productHoldingLineId: "123",
  currentVehicleDetails: {
    registrationNumber: "1ANURAG",
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    variant: "Sedan",
    series: "E210",
    body: "Sedan",
    height: 1435,
    length: 4630,
    width: 1780,
    kerbWeight: 1300,
    transmission: "Automatic",
    fuel: "Petrol",
    cylinder: "4",
    cc: "1798",
    co2Emission: "120",
    vin: "JTDBU4EE9B9123456",
    nvic: "1234567890",
    color: "Blue",
    vehicleType: "CAR",
  },
  searchedVehicleDetails: {
    registrationNumber: "1ANURAG",
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    variant: "Sedan",
    series: "E210",
    body: "Sedan",
    height: 1435,
    length: 4630,
    width: 1780,
    kerbWeight: 1300,
    transmission: "Automatic",
    fuel: "Petrol",
    cylinder: "4",
    cc: "1798",
    co2Emission: "120",
    vin: "JTDBU4EE9B9123456",
    nvic: "1234567890",
    vehicleType: "CAR",
  },
  steps: {
    yourVehicle: undefined,
    updateVehicle: {
      vehicleColour: "Blue",
      vehicleNotFound: "false",
      vehicleRego: "1ANURAG",
      vehicleSelect: "true",
      vehicleType: "Car",
    },
    confirmVehicle: {
      vehicleUpdated: false,
    },
  },
} as const satisfies UpdateYourVehicleSession;

describe("confirmVehicle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should redirect to system unavailable if searchedVehicleDetails is undefined", async () => {
    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      session: { ...mockUpdateYourVehicleSession, searchedVehicleDetails: undefined },
      sessionTtl: 123456,
    });

    await confirmVehicle();

    expect(getUpdateYourVehicleSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  });

  it("should update vehicle and redirect to confirmation page", async () => {
    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      session: mockUpdateYourVehicleSession,
      sessionTtl: 123456,
    });
    vi.mocked(updateRoadsideVehicle).mockResolvedValue({
      data: { updateRoadsideVehicle: { __typename: "RoadsideProduct" } },
      errors: undefined,
    });
    vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(undefined);

    await confirmVehicle();

    expect(getUpdateYourVehicleSession).toHaveBeenCalled();
    expect(updateRoadsideVehicle).toHaveBeenCalledWith({
      productId: mockUpdateYourVehicleSession.productHoldingHeaderId,
      lineId: mockUpdateYourVehicleSession.productHoldingLineId,
      newVehicleDetail: {
        ...mockUpdateYourVehicleSession.searchedVehicleDetails,
        color: mockUpdateYourVehicleSession.steps.updateVehicle.vehicleColour,
      },
    });
    expect(setUpdateYourVehicleSession).toHaveBeenCalledWith({
      session: {
        ...mockUpdateYourVehicleSession,
        steps: {
          ...mockUpdateYourVehicleSession.steps,
          confirmVehicle: { vehicleUpdated: true },
        },
      },
      currentPage: "/confirm-vehicle",
    });
    expect(redirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/confirmation" }));
  });

  it("should redirect to system unavailable if updateVehicle returns errors", async () => {
    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      session: mockUpdateYourVehicleSession,
      sessionTtl: 123456,
    });
    vi.mocked(updateRoadsideVehicle).mockResolvedValue({
      data: { updateRoadsideVehicle: { __typename: "RoadsideProduct" } },
      errors: [{ name: "Error", message: "Error" }],
    });

    await confirmVehicle();

    expect(getUpdateYourVehicleSession).toHaveBeenCalled();
    expect(updateRoadsideVehicle).toHaveBeenCalledWith({
      productId: mockUpdateYourVehicleSession.productHoldingHeaderId,
      lineId: mockUpdateYourVehicleSession.productHoldingLineId,
      newVehicleDetail: {
        ...mockUpdateYourVehicleSession.searchedVehicleDetails,
        color: mockUpdateYourVehicleSession.steps.updateVehicle.vehicleColour,
      },
    });
    expect(redirect).toHaveBeenCalledWith(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  });
});
