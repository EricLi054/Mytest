import type { z } from "zod";
import { getServerSession } from "next-auth";
import { describe, expect, it, vi } from "vitest";

import { execute } from "@racwa/gql";

import type { ADB2CSchema } from "./schema";
import { getADB2CAccount } from ".";

vi.mock("server-only", () => ({}));
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

describe("ADB2C Graphql", () => {
  it("should return a person", async () => {
    const mockAccount: z.infer<typeof ADB2CSchema> = {
      adb2CAccount: {
        id: "5678",
        crmId: "1234",
      },
    };

    vi.mocked(getServerSession).mockReturnValue(Promise.resolve("12345"));
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve({ data: mockAccount }));
    const data = await getADB2CAccount();

    expect(data).toEqual(mockAccount.adb2CAccount);
  });
});
