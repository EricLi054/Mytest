import type { Mock } from "vitest";
import { render } from "@testing-library/react";
import { deleteSessionAction } from "#app/register/(register)/actions";
import { describe, expect, it, vi } from "vitest";

import ClearSession from ".";

vi.mock("server-only", () => ({}));
vi.mock("next-auth/react");
vi.mock("#app/register/(register)/actions");

describe("ClearSession", () => {
  it("should call deleteSessionAction on mount", () => {
    render(<ClearSession />);

    expect(deleteSessionAction).toHaveBeenCalled();
  });

  it("should handle errors gracefully", () => {
    // Mock deleteSessionAction to throw an error
    (deleteSessionAction as Mock).mockImplementationOnce(() => {
      throw new Error("Failed to delete session cookie");
    });

    render(<ClearSession />);

    expect(deleteSessionAction).toHaveBeenCalled();
  });
});
