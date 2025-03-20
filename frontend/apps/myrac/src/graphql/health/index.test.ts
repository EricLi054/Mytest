import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import { getHealthData } from ".";

vi.mock("server-only", () => ({}));
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const healthyResponse = {
  data: {
    rac_landingPageCollection: {
      items: [
        {
          __typename: "LandingPage",
        },
      ],
    },
    serviceIsAlive: {
      personService: true,
    },
  },
};

const errorsArrayResponse = {
  data: null,
  errors: [
    {
      name: "Error",
      message: "Error",
    },
  ],
};

describe("Health Check GraphQL", () => {
  it("should return true when everything is good", async () => {
    vi.mocked(execute).mockResolvedValue(healthyResponse);
    const health = await getHealthData();

    expect(health).toEqual(true);
  });

  it("should return false when person is down", async () => {
    const errorResponse = healthyResponse;
    errorResponse.data.serviceIsAlive.personService = false;
    vi.mocked(execute).mockResolvedValue(errorResponse);
    const health = await getHealthData();

    expect(health).toEqual(false);
  });

  it("should return false when contentful is down", async () => {
    const errorResponse = healthyResponse;
    errorResponse.data.rac_landingPageCollection.items = [];
    vi.mocked(execute).mockResolvedValue(errorResponse);
    const health = await getHealthData();

    expect(health).toEqual(false);
  });

  it("should return false when an error is returned", async () => {
    vi.mocked(execute).mockResolvedValue(errorsArrayResponse);
    const health = await getHealthData();

    expect(health).toEqual(false);
  });

  it("should return false when an exception is thrown", async () => {
    vi.mocked(execute).mockRejectedValue(new Error("GraphQL error"));
    const health = await getHealthData();

    expect(health).toEqual(false);
  });
});
