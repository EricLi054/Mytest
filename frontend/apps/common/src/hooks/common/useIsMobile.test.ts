import type { Mock } from "vitest";
import { useMediaQuery, useTheme } from "@mui/material";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useIsMobile } from "./useIsMobile";

vi.mock("@mui/material", () => ({
  useMediaQuery: vi.fn(),
  useTheme: vi.fn(),
}));

describe("useIsMobile Hook", () => {
  it("should return true when the screen width is below the 'md' breakpoint", () => {
    const mockTheme = {
      breakpoints: {
        down: (size: string) => `(max-width: ${size})`,
      },
    };
    (useTheme as Mock).mockReturnValue(mockTheme);

    (useMediaQuery as Mock).mockReturnValue(true);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("should return false when the screen width is above the 'md' breakpoint", () => {
    const mockTheme = {
      breakpoints: {
        down: (size: string) => `(max-width: ${size})`,
      },
    };
    (useTheme as Mock).mockReturnValue(mockTheme);

    (useMediaQuery as Mock).mockReturnValue(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});
