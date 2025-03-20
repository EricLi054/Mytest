import { redirect } from "next/navigation";
import { mockTracer } from "#testing/otel";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UpdateYourVehicleSession } from "../../session/types";
import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../session";
import { yourVehicle } from "./actions";

vi.mock("next/navigation");
vi.mock("../../session");

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
  searchedVehicleDetails: undefined,
  steps: {
    yourVehicle: undefined,
    updateVehicle: undefined,
    confirmVehicle: {
      vehicleUpdated: false,
    },
  },
} as const satisfies UpdateYourVehicleSession;

describe("YourVehicleAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.each([
    { vehicleUse: "Business use", isBrokenDown: "No" },
    { vehicleUse: "Business use", isBrokenDown: "Yes" },
    { vehicleUse: "Private use", isBrokenDown: "Yes" },
  ])(
    "should fail validation with vehicleUse: $vehicleUse and isBrokenDown: $isBrokenDown",
    async ({ vehicleUse, isBrokenDown }) => {
      const invalidVehicleFormData = new FormData();
      invalidVehicleFormData.append("vehicleUse", vehicleUse);
      invalidVehicleFormData.append("isBrokenDown", isBrokenDown);

      const reply = await yourVehicle(undefined, invalidVehicleFormData);

      expect(reply).toBeDefined();
      expect(reply.status).toBe("error");
    },
  );

  it("should pass validation with vehicleUse: 'Private use' and isBrokenDown: 'No' and redirect to your vehicle", async () => {
    const validVehicleFormData = new FormData();
    validVehicleFormData.append("vehicleUse", "Private use");
    validVehicleFormData.append("isBrokenDown", "No");

    const updatedSession = {
      ...mockUpdateYourVehicleSession,
      steps: {
        yourVehicle: { vehicleUse: "Private use", isBrokenDown: "No" },
        updateVehicle: undefined,
        confirmVehicle: {
          vehicleUpdated: false,
        },
      },
    };

    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      session: mockUpdateYourVehicleSession,
      sessionTtl: 123456,
    });
    vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(undefined);

    await yourVehicle(undefined, validVehicleFormData);

    expect(getUpdateYourVehicleSession).toHaveBeenCalled();
    expect(setUpdateYourVehicleSession).toHaveBeenCalledWith({
      session: updatedSession,
      currentPage: "/your-vehicle",
    });
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith<Parameters<typeof redirect>>(
      getUpdateYourVehiclePageUrl({ page: "/update-vehicle" }),
    );
  });
});
