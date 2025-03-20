import { redirect } from "next/navigation";
import { mockTracer } from "#testing/otel";
import { getVehicleCardInfo } from "#utils/getVehicleCardInfo";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PickFromQuery } from "@racwa/types";

import type { UpdateYourVehicleSession } from "../../session/types";
import type { VehicleDetail } from "../../types";
import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../session";
import { getVehicleByRego, updateVehicle } from "./actions";
import { getVehicleDetailsByRego } from "./data";

vi.mock("next/navigation");
vi.mock("../../session");
vi.mock("./data");

vi.mock("server-only", () => ({}));

vi.mock("@opentelemetry/api", () => ({
  trace: { getTracer: mockTracer },
}));

const mockValidFormData = new FormData();
mockValidFormData.append("vehicleType", "Car");
mockValidFormData.append("vehicleRego", "1ANURAG");
mockValidFormData.append("vehicleSelect", "true");
mockValidFormData.append("vehicleNotFound", "false");
mockValidFormData.append("vehicleColour", "Blue");

const mockUpdateYourVehicleSession = {
  crmId: "123",
  firstName: "John",
  productHoldingHeaderId: "123",
  productHoldingLineId: "123",
  currentVehicleDetails: {
    registrationNumber: "1TOM",
    year: 2021,
    make: "Mitsubishi",
    model: "Lancer Evolution",
    variant: "GSR",
    series: "CZ4A",
    body: "Sedan",
    height: 1480,
    length: 4495,
    width: 1810,
    kerbWeight: 1530,
    transmission: "Manual",
    fuel: "Petrol",
    cylinder: "4",
    cc: "1998",
    co2Emission: "240",
    vin: "JMYSNCY4A12345678",
    nvic: "9876543210",
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
    updateVehicle: undefined,
    confirmVehicle: {
      vehicleUpdated: false,
    },
  },
} as const satisfies UpdateYourVehicleSession;

describe("updateVehicle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fail validation and return errors", async () => {
    const invalidFormData = new FormData();
    invalidFormData.append("vehicleRego", "");

    const reply = await updateVehicle(undefined, invalidFormData);

    expect(reply).toBeDefined();
    expect(reply.status).toBe("error");
  });

  it("should pass validation, update session, and redirect to confirm vehicle", async () => {
    const updatedSession = {
      ...mockUpdateYourVehicleSession,
      steps: {
        ...mockUpdateYourVehicleSession.steps,
        updateVehicle: {
          vehicleType: "Car",
          vehicleRego: "1ANURAG",
          vehicleSelect: "true",
          vehicleColour: "Blue",
          vehicleNotFound: "false",
        },
      },
    };

    vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
      session: mockUpdateYourVehicleSession,
      sessionTtl: 123456,
    });
    vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(undefined);

    await updateVehicle(undefined, mockValidFormData);

    expect(getUpdateYourVehicleSession).toHaveBeenCalled();
    expect(setUpdateYourVehicleSession).toHaveBeenCalledWith({
      session: updatedSession,
      currentPage: "/update-vehicle",
    });
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith<Parameters<typeof redirect>>(
      getUpdateYourVehiclePageUrl({ page: "/confirm-vehicle" }),
    );
  });

  describe("getVehicleByRego", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should return undefined if vehicleByRego is not found", async () => {
      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: undefined,
        data: { vehicleByRego: null },
      });

      const result = await getVehicleByRego({ vehicleType: "CAR", registrationNumber: "1ANURAG" });

      expect(result).toBeUndefined();
    });

    it("should redirect to system-unavailable if errors are present", async () => {
      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: [{ name: "Error", message: "Error" }],
        data: { vehicleByRego: null },
      });

      await getVehicleByRego({ vehicleType: "CAR", registrationNumber: "1ANURAG12345678" });

      expect(redirect).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith<Parameters<typeof redirect>>(
        getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }),
      );
    });

    it("should update session and return vehicle info if vehicleByRego is found", async () => {
      const mockVehicleDetails = {
        registrationNumber: "1ANURAG",
        year: 2022,
        make: "Honda",
        model: "Civic",
        variant: "Sport",
        body: "Sedan",
        transmission: "Auto",
        fuel: "Petrol",
        height: 1435,
        length: 4630,
        width: 1780,
        kerbWeight: 1300,
        series: "E210",
        cylinder: "4",
        cc: "1798",
        co2Emission: "120",
        vin: "JTDBU4EE9B9123456",
        nvic: "1234567890",
      } as const satisfies PickFromQuery<typeof getVehicleDetailsByRego, "vehicleByRego">;

      const vehicleType = "CAR" satisfies VehicleDetail["vehicleType"];

      vi.mocked(getVehicleDetailsByRego).mockResolvedValue({
        errors: undefined,
        data: { vehicleByRego: mockVehicleDetails },
      });

      vi.mocked(getUpdateYourVehicleSession).mockResolvedValue({
        session: mockUpdateYourVehicleSession,
        sessionTtl: 123456,
      });
      vi.mocked(setUpdateYourVehicleSession).mockResolvedValue(undefined);

      const result = await getVehicleByRego({ vehicleType, registrationNumber: "1ANURAG" });
      const expectedResult = getVehicleCardInfo(mockVehicleDetails);

      expect(getUpdateYourVehicleSession).toHaveBeenCalled();
      expect(setUpdateYourVehicleSession).toHaveBeenCalledWith({
        session: {
          ...mockUpdateYourVehicleSession,
          searchedVehicleDetails: { ...mockVehicleDetails, vehicleType },
        },
        currentPage: "/update-vehicle",
      });
      expect(expectedResult.success).toBe(true);

      if (expectedResult.success) {
        expect(result).toEqual(expectedResult);
      }
    });
  });
});
