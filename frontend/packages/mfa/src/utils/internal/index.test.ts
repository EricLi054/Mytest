import { describe, expect, it } from "vitest";

import { createId } from ".";

describe("Utils Internal", () => {
  describe("createId", () => {
    it("should create id", () => {
      expect(createId("one", "two")).toBe("one-two");
      expect(createId("!-", "-!")).toBe("!---!");
      expect(createId("O", "O")).toBe("O-O");
    });

    it("should create id with suffix only when prefix is empty string", () => {
      expect(createId("", "suffix")).toBe("suffix");
      expect(createId(" ", "suffix")).toBe("suffix");
    });

    it("should create id with prefix leading and trailing whitespace trimmed", () => {
      expect(createId(" prefix", "suffix")).toBe("prefix-suffix");
      expect(createId("prefix ", "suffix")).toBe("prefix-suffix");
    });

    it("should create id with suffix leading and trailing whitespace trimmed", () => {
      expect(createId("prefix", " suffix")).toBe("prefix-suffix");
      expect(createId("prefix", "suffix ")).toBe("prefix-suffix");
    });
  });
});
