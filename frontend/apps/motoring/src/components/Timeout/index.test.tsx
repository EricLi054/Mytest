import { useRouter } from "next/navigation";
import { render, waitFor } from "@testing-library/react";
import { mockAppRouterInstance } from "#testing/next";
import { describe, expect, it, vi } from "vitest";

import Timeout from ".";

vi.mock("next/navigation");

const gracePeriod = 3_000;
const sessionTimeoutUrl = "/session-timeout";
const setTimeoutDelayMax = 0x7fffffff;

describe("Timeout", () => {
  it("should navigate to sessionTimeoutUrl after (sessionTtl + grace period) milliseconds", async () => {
    const sessionTtl = 1_000; // 1 second
    const mockRouter = mockAppRouterInstance();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    const setTimeoutSpy = vi.spyOn(window, "setTimeout");

    render(<Timeout sessionTtl={sessionTtl} sessionTimeoutUrl={sessionTimeoutUrl} />);

    await waitFor(
      () => {
        expect(mockRouter.replace).toHaveBeenCalled();
      },
      { timeout: (sessionTtl + gracePeriod) * 2 },
    );

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), sessionTtl + gracePeriod);
  });

  it("should round navigation delay to 0 when (sessionTtl + grace period) < 0", () => {
    const sessionTtl = -gracePeriod - 1;
    const setTimeoutSpy = vi.spyOn(window, "setTimeout");

    render(<Timeout sessionTtl={sessionTtl} sessionTimeoutUrl={sessionTimeoutUrl} />);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);
    expect(sessionTtl + gracePeriod).toBeLessThan(0);
  });

  it("should round navigation delay to sessionTimeoutDelayMax when (sessionTtl + grace period) > sessionTimeoutDelayMax", () => {
    const sessionTtl = setTimeoutDelayMax + 1 - gracePeriod;
    const setTimeoutSpy = vi.spyOn(window, "setTimeout");

    render(<Timeout sessionTtl={sessionTtl} sessionTimeoutUrl={sessionTimeoutUrl} />);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), setTimeoutDelayMax);
    expect(sessionTtl + gracePeriod).toBeGreaterThan(setTimeoutDelayMax);
  });
});
