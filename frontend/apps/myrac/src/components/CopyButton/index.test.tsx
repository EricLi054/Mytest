import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import CopyButton, { TOOLTIP_TIMEOUT_INTERVAL_SECONDS } from "./";

library.add(fas);
userEvent.setup();

vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

describe("CopyButton", () => {
  it("should be rendered", () => {
    render(<CopyButton text={undefined} />);

    const copyButton = screen.getByRole("button", {
      name: "copy to clipboard",
    });

    expect(copyButton).not.toBe(null);
  });

  it("should copy text to clipboard when clicked", async () => {
    render(<CopyButton text="copy me please" />);

    const copyButton = screen.getByRole("button", {
      name: "copy to clipboard",
    });

    await userEvent.click(copyButton);

    const clipboardText = await navigator.clipboard.readText();

    expect(clipboardText).toBe("copy me please");
  });

  it("should show tooltip when clicked", async () => {
    render(<CopyButton text="copy me please" />);

    const copyButton = screen.getByRole("button", {
      name: "copy to clipboard",
    });

    await userEvent.click(copyButton);

    const tooltip = screen.getByText("Copied!");

    expect(tooltip).toBeVisible();
  });

  it("should hide tooltip after timing out", async () => {
    // user-event adds a delay between some subsequent inputs.
    // When using fake timers it is necessary to set this option
    // to your test runner's time advancement function.
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(
      <div>
        <CopyButton text="copy me please" />
      </div>,
    );

    const copyButton = screen.getByRole("button", {
      name: "copy to clipboard",
    });

    await act(async () => {
      await user.click(copyButton);
    });

    const tooltip = screen.getByText("Copied!");

    expect(tooltip).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(TOOLTIP_TIMEOUT_INTERVAL_SECONDS * 2 * 1000);
    });

    await waitFor(() => {
      expect(screen.getByText("Copied!")).not.toBeVisible();
    });

    vi.useRealTimers();
  });

  it("should trigger GA event when copy button clicked", async () => {
    render(
      <div>
        <CopyButton text="copy me please" />
      </div>,
    );
    await testHelper.clickButton("copy to clipboard", screen);

    expect(logEvent).toHaveBeenCalledWith("Digital card - Copy member number");
  });
});
