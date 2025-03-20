import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getVehicleDetailsByRego } from "./data";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql");
vi.mock("#utils/getAccessToken");

type Variables = Parameters<typeof getVehicleDetailsByRego>[0]["vehicleByRego"];

const { GRAPHQL_ENDPOINT } = serverEnv();

describe("getVehicleDetailsByRego", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call execute with the correct parameters", async () => {
    const vehicleType = "CAR" satisfies Variables["vehicleType"];
    const registrationNumber = "1ANURAG";
    const state = "NSW" satisfies Variables["state"];

    const mockToken = "mock-token";
    const mockResponse = {
      data: {
        vehicleByRego: {
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
          registrationNumber: "1ANURAG",
          vin: "JTDBU4EE9B9123456",
          nvic: "1234567890",
        },
      },
    } as const satisfies Awaited<ReturnType<typeof getVehicleDetailsByRego>>;

    vi.mocked(execute).mockResolvedValue(mockResponse);
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);

    const result = await getVehicleDetailsByRego({ vehicleByRego: { vehicleType, registrationNumber, state } });

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "motoring",
      token: mockToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: { vehicleByRego: { vehicleType, registrationNumber, state } },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors correctly", async () => {
    const vehicleType = "CAR" satisfies Variables["vehicleType"];
    const registrationNumber = "1ANURAG";
    const state = "NSW" satisfies Variables["state"];

    const mockToken = "mock-token";
    vi.mocked(execute).mockRejectedValue(new Error("GraphQL error"));
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);

    await expect(
      getVehicleDetailsByRego({ vehicleByRego: { vehicleType, registrationNumber, state } }),
    ).rejects.toThrow("GraphQL error");

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "motoring",
      token: mockToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: { vehicleByRego: { vehicleType, registrationNumber, state } },
    });
  });
});
