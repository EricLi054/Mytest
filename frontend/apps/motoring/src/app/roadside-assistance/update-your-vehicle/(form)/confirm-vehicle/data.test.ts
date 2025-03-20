import { serverEnv } from "#env/server";
import { getAccessToken } from "#utils/getAccessToken";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { updateRoadsideVehicle } from "./data";

vi.mock("server-only", () => {
  return {};
});

vi.mock("@racwa/gql");
vi.mock("#utils/getAccessToken");

const { GRAPHQL_ENDPOINT } = serverEnv();

const productId = "test-product-id";
const lineId = "test-line-id";
const mockToken = "mock-token";

const newVehicleDetail = {
  year: 2021,
  make: "Toyota",
  model: "Camry",
  variant: "XSE",
  series: "Series 1",
  body: "Sedan",
  height: 1450,
  length: 4850,
  width: 1820,
  kerbWeight: 1500,
  transmission: "Automatic",
  fuel: "Petrol",
  cylinder: "4",
  cc: "2500",
  co2Emission: "150",
  registrationNumber: "ABC123",
  vin: "1HGCM82633A123456",
  nvic: "NVIC123456",
  color: "Blue",
  vehicleType: "CAR",
} as const satisfies Parameters<typeof updateRoadsideVehicle>[0]["newVehicleDetail"];

describe("updateVehicle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call execute with the correct parameters", async () => {
    const mockResponse = {
      data: { updateRoadsideVehicle: { __typename: "RoadsideProduct" } },
    } as const satisfies Awaited<ReturnType<typeof updateRoadsideVehicle>>;
    vi.mocked(execute).mockResolvedValue(mockResponse);
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);

    const result = await updateRoadsideVehicle({ productId, lineId, newVehicleDetail });

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "motoring",
      token: mockToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: { productId, lineId, newVehicleDetail },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors correctly", async () => {
    vi.mocked(execute).mockRejectedValue(new Error("GraphQL error"));
    vi.mocked(getAccessToken).mockResolvedValue(mockToken);

    await expect(updateRoadsideVehicle({ productId, lineId, newVehicleDetail })).rejects.toThrow("GraphQL error");

    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      endpoint: GRAPHQL_ENDPOINT,
      sourceSystem: "motoring",
      token: mockToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: expect.anything(),
      variables: { productId, lineId, newVehicleDetail },
    });
  });
});
