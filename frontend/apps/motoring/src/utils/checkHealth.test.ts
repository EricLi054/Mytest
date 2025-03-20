import { describe, expect, it } from "vitest";

import { checkHealth } from "./checkHealth";

describe("checkHealth", () => {
  it("should return success when no services are dead", () => {
    const result = checkHealth({ waves: true, uno: true, cookies: true });

    expect(result.success).toBe(true);
  });

  it("should return failure and dead services when some services are dead", () => {
    const result = checkHealth({ waves: false, uno: false, cookies: true });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.deadServices).toContain("waves");
      expect(result.deadServices).toContain("uno");
      expect(result.deadServices).not.toContain("cookies");
    }
  });
});
