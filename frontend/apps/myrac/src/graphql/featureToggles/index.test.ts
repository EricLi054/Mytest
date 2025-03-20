import type { z } from "zod";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { FeatureToggleSchema } from "./schema";
import { getFeatureToggles } from ".";

vi.mock("server-only", () => ({}));
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("FeatureToggles Graphql", () => {
  it("should return feature toggles", async () => {
    const mockToggles: z.infer<typeof FeatureToggleSchema> = {
      featureToggles: [
        {
          key: "toggle",
          value: true,
        },
      ],
    };

    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockToggles }));
    const data = await getFeatureToggles();

    expect(data).toEqual(mockToggles.featureToggles);
  });

  it("should return empty array if no session", async () => {
    vi.mocked(getServerSession).mockReturnValue(Promise.resolve(null));

    const data = await getFeatureToggles();

    expect(data).toEqual([]);
  });
});
