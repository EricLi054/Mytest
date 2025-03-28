import type { Mock } from "vitest";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { deleteSessionCookie } from "./actions";
import DeleteCookie from "./DeleteCookie";

vi.mock("./actions", () => ({
  deleteSessionCookie: vi.fn(),
}));

describe("DeleteCookie", () => {
  it("should call deleteSessionCookie on mount", () => {
    render(<DeleteCookie />);

    expect(deleteSessionCookie).toHaveBeenCalled();
  });

  it("should handle errors gracefully", () => {
    // Mock deleteSessionCookie to throw an error
    (deleteSessionCookie as Mock).mockImplementationOnce(() => {
      throw new Error("Failed to delete session cookie");
    });

    render(<DeleteCookie />);

    expect(deleteSessionCookie).toHaveBeenCalled();
  });
});
