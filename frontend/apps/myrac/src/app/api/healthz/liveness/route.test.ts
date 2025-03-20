/**
 * @jest-environment node
 */
import { describe, expect, it } from "vitest";

import { GET } from "./route";

// Write a test using Jest
describe("Liveness Health Check", () => {
  it("should return a healthy confirmation", async () => {
    const data = GET();

    // Assert the expected behavior
    expect(data.status).toEqual(200);
    expect(await data.json()).toStrictEqual("Healthy");
  });
});
