/**
 * @jest-environment node
 */
import { getHealthData } from "#graphql/health";
import { describe, expect, it, vi } from "vitest";

import { GET } from "./route";

vi.mock("#graphql/health", () => ({
  getHealthData: vi.fn(),
}));

describe("Readiness Health Check", () => {
  it("should return a healthy confirmation", async () => {
    vi.mocked(getHealthData).mockResolvedValue(true);
    const data = await GET();

    expect(data.status).toEqual(200);
    expect(await data.json()).toStrictEqual("Ready");
  });

  it("should return an unhealthy response", async () => {
    vi.mocked(getHealthData).mockResolvedValue(false);
    const data = await GET();

    expect(data.status).toEqual(503);
    expect(await data.json()).toStrictEqual("Not ready");
  });
});
