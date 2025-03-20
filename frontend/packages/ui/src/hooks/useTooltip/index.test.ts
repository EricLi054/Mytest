import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useTooltip from ".";

describe("useTooltip", () => {
  it("should be able to initialise", () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.open).toBe(false);
    expect(result.current.onClick).toBeInstanceOf(Function);
    expect(result.current.onClickClose).toBeInstanceOf(Function);
    expect(result.current.onClickAway).toBeInstanceOf(Function);
  });

  it("should set open to not open when onClose is called", async () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.open).toBe(false);

    act(() => result.current.onClick());

    await waitFor(() => expect(result.current.open).toBe(true));

    act(() => result.current.onClick());

    await waitFor(() => expect(result.current.open).toBe(false));
  });

  it("should set open to false when onClickClose is called", async () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.onClick();
    });

    await waitFor(() => expect(result.current.open).toBe(true));

    act(() => {
      // Call twice to ensure the function always sets open to false
      result.current.onClickClose();
      result.current.onClickClose();
    });

    await waitFor(() => expect(result.current.open).toBe(false));
  });

  it("should set open to false when onClickAway is called", async () => {
    const { result } = renderHook(() => useTooltip());

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.onClick();
    });

    await waitFor(() => expect(result.current.open).toBe(true));

    act(() => {
      // Call twice to ensure the function always sets open to false
      result.current.onClickAway();
      result.current.onClickAway();
    });

    await waitFor(() => expect(result.current.open).toBe(false));
  });
});
