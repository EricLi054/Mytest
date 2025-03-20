import type { Mock } from "vitest";
import type { z } from "zod";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { PolicyDetailsResponseSchema } from "./schema";
import { getPolicyDetails } from ".";

vi.mock("server-only", () => ({}));
vi.mock("#utils/session/getCrmId");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("Policy Details GraphQL", () => {
  it("should return policy details", async () => {
    const mockPolicyDetails: z.infer<typeof PolicyDetailsResponseSchema> = {
      data: {
        policyDetails: [
          {
            registrationNumber: "123ABC",
            subtitle: "Test Subtitle",
            subtitleSecondary: "Secondary Subtitle",
            title: "Test Policy",
            type: "ROAD",
            actions: [],
            alerts: [],
            policyItems: [],
          },
        ],
      },
    };

    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute as Mock).mockReturnValueOnce(Promise.resolve(mockPolicyDetails));
    const data = await getPolicyDetails();

    expect(data).toEqual(mockPolicyDetails);
  });
});
